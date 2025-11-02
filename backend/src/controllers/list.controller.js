import { List } from "../models/list.model.js";
import { User } from "../models/user.model.js";

// Create a new list
export const createList = async (req, res) => {
  try {
    const { name, description, channelId, channelName, color } = req.body;
    const userId = req.auth().userId; // From Clerk auth

    if (!name || !channelId || !channelName) {
      return res.status(400).json({ 
        success: false, 
        message: "Name, channelId, and channelName are required" 
      });
    }

    const user = await User.findOne({ clerkId: userId });
    if (!user) {
      return res.status(404).json({ 
        success: false, 
        message: "User not found" 
      });
    }

    const newList = new List({
      name,
      description: description || "",
      channelId,
      channelName,
      createdBy: user._id,
      items: [],
      sharedWith: [],
      color: color || "#1264a3"
    });

    await newList.save();

    const populatedList = await List.findById(newList._id)
      .populate('createdBy', 'name email image')
      .populate('sharedWith', 'name email image');

    res.status(201).json({
      success: true,
      message: "List created successfully",
      data: populatedList
    });
  } catch (error) {
    console.error("Error creating list:", error);
    res.status(500).json({
      success: false,
      message: "Failed to create list",
      error: error.message
    });
  }
};

// Get all lists for a user
export const getUserLists = async (req, res) => {
  try {
    const userId = req.auth().userId;
    const { filter = 'all', channelId } = req.query;

    const user = await User.findOne({ clerkId: userId });
    if (!user) {
      return res.status(404).json({ 
        success: false, 
        message: "User not found" 
      });
    }

    let query = { isArchived: false };

    // Apply filters
    if (filter === 'created') {
      query.createdBy = user._id;
    } else if (filter === 'shared') {
      query.sharedWith = user._id;
    } else {
      // 'all' - lists created by user or shared with user
      query.$or = [
        { createdBy: user._id },
        { sharedWith: user._id }
      ];
    }

    // Filter by channel if provided
    if (channelId) {
      query.channelId = channelId;
    }

    const lists = await List.find(query)
      .populate('createdBy', 'name email image')
      .populate('sharedWith', 'name email image')
      .populate('items.assignedTo', 'name email image')
      .populate('items.createdBy', 'name email image')
      .sort({ updatedAt: -1 });

    res.status(200).json({
      success: true,
      data: lists
    });
  } catch (error) {
    console.error("Error fetching lists:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch lists",
      error: error.message
    });
  }
};

// Get a single list by ID
export const getListById = async (req, res) => {
  try {
    const { listId } = req.params;
    const userId = req.auth().userId;

    const user = await User.findOne({ clerkId: userId });
    if (!user) {
      return res.status(404).json({ 
        success: false, 
        message: "User not found" 
      });
    }

    const list = await List.findById(listId)
      .populate('createdBy', 'name email image')
      .populate('sharedWith', 'name email image')
      .populate('items.assignedTo', 'name email image')
      .populate('items.createdBy', 'name email image');

    if (!list) {
      return res.status(404).json({
        success: false,
        message: "List not found"
      });
    }

    // Check if user has access to this list
    const hasAccess = 
      list.createdBy._id.toString() === user._id.toString() ||
      list.sharedWith.some(u => u._id.toString() === user._id.toString());

    if (!hasAccess) {
      return res.status(403).json({
        success: false,
        message: "You don't have access to this list"
      });
    }

    res.status(200).json({
      success: true,
      data: list
    });
  } catch (error) {
    console.error("Error fetching list:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch list",
      error: error.message
    });
  }
};

// Update a list
export const updateList = async (req, res) => {
  try {
    const { listId } = req.params;
    const userId = req.auth().userId;
    const updates = req.body;

    const user = await User.findOne({ clerkId: userId });
    if (!user) {
      return res.status(404).json({ 
        success: false, 
        message: "User not found" 
      });
    }

    const list = await List.findById(listId);
    if (!list) {
      return res.status(404).json({
        success: false,
        message: "List not found"
      });
    }

    // Only creator can update list metadata
    if (list.createdBy.toString() !== user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: "Only the list creator can update list details"
      });
    }

    // Update allowed fields
    const allowedUpdates = ['name', 'description', 'color'];
    allowedUpdates.forEach(field => {
      if (updates[field] !== undefined) {
        list[field] = updates[field];
      }
    });

    await list.save();

    const updatedList = await List.findById(listId)
      .populate('createdBy', 'name email image')
      .populate('sharedWith', 'name email image');

    res.status(200).json({
      success: true,
      message: "List updated successfully",
      data: updatedList
    });
  } catch (error) {
    console.error("Error updating list:", error);
    res.status(500).json({
      success: false,
      message: "Failed to update list",
      error: error.message
    });
  }
};

// Add item to list
export const addListItem = async (req, res) => {
  try {
    const { listId } = req.params;
    const { text, assignedTo, dueDate } = req.body;
    const userId = req.auth().userId;

    if (!text) {
      return res.status(400).json({
        success: false,
        message: "Item text is required"
      });
    }

    const user = await User.findOne({ clerkId: userId });
    if (!user) {
      return res.status(404).json({ 
        success: false, 
        message: "User not found" 
      });
    }

    const list = await List.findById(listId);
    if (!list) {
      return res.status(404).json({
        success: false,
        message: "List not found"
      });
    }

    // Check if user has access
    const hasAccess = 
      list.createdBy.toString() === user._id.toString() ||
      list.sharedWith.some(u => u.toString() === user._id.toString());

    if (!hasAccess) {
      return res.status(403).json({
        success: false,
        message: "You don't have access to this list"
      });
    }

    const newItem = {
      text,
      completed: false,
      assignedTo: assignedTo || null,
      createdBy: user._id,
      dueDate: dueDate || null,
      order: list.items.length
    };

    list.items.push(newItem);
    await list.save();

    const updatedList = await List.findById(listId)
      .populate('createdBy', 'name email image')
      .populate('sharedWith', 'name email image')
      .populate('items.assignedTo', 'name email image')
      .populate('items.createdBy', 'name email image');

    res.status(200).json({
      success: true,
      message: "Item added successfully",
      data: updatedList
    });
  } catch (error) {
    console.error("Error adding item:", error);
    res.status(500).json({
      success: false,
      message: "Failed to add item",
      error: error.message
    });
  }
};

// Update list item
export const updateListItem = async (req, res) => {
  try {
    const { listId, itemId } = req.params;
    const updates = req.body;
    const userId = req.auth().userId;

    const user = await User.findOne({ clerkId: userId });
    if (!user) {
      return res.status(404).json({ 
        success: false, 
        message: "User not found" 
      });
    }

    const list = await List.findById(listId);
    if (!list) {
      return res.status(404).json({
        success: false,
        message: "List not found"
      });
    }

    const item = list.items.id(itemId);
    if (!item) {
      return res.status(404).json({
        success: false,
        message: "Item not found"
      });
    }

    // Update allowed fields
    if (updates.text !== undefined) item.text = updates.text;
    if (updates.completed !== undefined) item.completed = updates.completed;
    if (updates.assignedTo !== undefined) item.assignedTo = updates.assignedTo;
    if (updates.dueDate !== undefined) item.dueDate = updates.dueDate;

    await list.save();

    const updatedList = await List.findById(listId)
      .populate('createdBy', 'name email image')
      .populate('sharedWith', 'name email image')
      .populate('items.assignedTo', 'name email image')
      .populate('items.createdBy', 'name email image');

    res.status(200).json({
      success: true,
      message: "Item updated successfully",
      data: updatedList
    });
  } catch (error) {
    console.error("Error updating item:", error);
    res.status(500).json({
      success: false,
      message: "Failed to update item",
      error: error.message
    });
  }
};

// Delete list item
export const deleteListItem = async (req, res) => {
  try {
    const { listId, itemId } = req.params;
    const userId = req.auth().userId;

    const user = await User.findOne({ clerkId: userId });
    if (!user) {
      return res.status(404).json({ 
        success: false, 
        message: "User not found" 
      });
    }

    const list = await List.findById(listId);
    if (!list) {
      return res.status(404).json({
        success: false,
        message: "List not found"
      });
    }

    list.items.pull(itemId);
    await list.save();

    const updatedList = await List.findById(listId)
      .populate('createdBy', 'name email image')
      .populate('sharedWith', 'name email image')
      .populate('items.assignedTo', 'name email image')
      .populate('items.createdBy', 'name email image');

    res.status(200).json({
      success: true,
      message: "Item deleted successfully",
      data: updatedList
    });
  } catch (error) {
    console.error("Error deleting item:", error);
    res.status(500).json({
      success: false,
      message: "Failed to delete item",
      error: error.message
    });
  }
};

// Delete a list
export const deleteList = async (req, res) => {
  try {
    const { listId } = req.params;
    const userId = req.auth().userId;

    const user = await User.findOne({ clerkId: userId });
    if (!user) {
      return res.status(404).json({ 
        success: false, 
        message: "User not found" 
      });
    }

    const list = await List.findById(listId);
    if (!list) {
      return res.status(404).json({
        success: false,
        message: "List not found"
      });
    }

    // Only creator can delete
    if (list.createdBy.toString() !== user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: "Only the list creator can delete this list"
      });
    }

    await List.findByIdAndDelete(listId);

    res.status(200).json({
      success: true,
      message: "List deleted successfully"
    });
  } catch (error) {
    console.error("Error deleting list:", error);
    res.status(500).json({
      success: false,
      message: "Failed to delete list",
      error: error.message
    });
  }
};

// Share list with users
export const shareList = async (req, res) => {
  try {
    const { listId } = req.params;
    const { userIds } = req.body; // Array of user IDs (MongoDB _id)
    const userId = req.auth().userId;

    const user = await User.findOne({ clerkId: userId });
    if (!user) {
      return res.status(404).json({ 
        success: false, 
        message: "User not found" 
      });
    }

    const list = await List.findById(listId);
    if (!list) {
      return res.status(404).json({
        success: false,
        message: "List not found"
      });
    }

    // Only creator can share
    if (list.createdBy.toString() !== user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: "Only the list creator can share this list"
      });
    }

    // Add new users to sharedWith array (avoiding duplicates)
    userIds.forEach(uid => {
      if (!list.sharedWith.includes(uid) && uid !== user._id.toString()) {
        list.sharedWith.push(uid);
      }
    });

    await list.save();

    const updatedList = await List.findById(listId)
      .populate('createdBy', 'name email image')
      .populate('sharedWith', 'name email image');

    res.status(200).json({
      success: true,
      message: "List shared successfully",
      data: updatedList
    });
  } catch (error) {
    console.error("Error sharing list:", error);
    res.status(500).json({
      success: false,
      message: "Failed to share list",
      error: error.message
    });
  }
};
