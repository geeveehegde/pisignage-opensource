import Group from '../models/group.js';

// Get all groups
export const getGroups = async (req, res) => {
    try {
        const groups = await Group.findAll();
        res.json({
            success: true,
            message: 'Groups retrieved successfully',
            data: groups
        });
    } catch (error) {
        console.error('Error getting groups:', error);
        res.status(500).json({
            success: false,
            message: 'Error retrieving groups',
            error: error.message
        });
    }
};

// Get single group by ID
export const getGroup = async (req, res) => {
    try {
        const group = await Group.load(req.params.id);
        if (!group) {
            return res.status(404).json({
                success: false,
                message: 'Group not found'
            });
        }
        res.json({
            success: true,
            message: 'Group retrieved successfully',
            data: group
        });
    } catch (error) {
        console.error('Error getting group:', error);
        res.status(500).json({
            success: false,
            message: 'Error retrieving group',
            error: error.message
        });
    }
};

// Create new group
export const createGroup = async (req, res) => {
    try {
        const groupData = {
            ...req.body,
            createdBy: {
                _id: req.user._id,
                name: req.user.email
            }
        };
        
        const group = await Group.createGroup(groupData);
        res.status(201).json({
            success: true,
            message: 'Group created successfully',
            data: group
        });
    } catch (error) {
        console.error('Error creating group:', error);
        res.status(400).json({
            success: false,
            message: 'Error creating group',
            error: error.message
        });
    }
};

// Update group
export const updateGroup = async (req, res) => {
    try {
        const group = await Group.updateGroup(req.params.id, req.body);
        if (!group) {
            return res.status(404).json({
                success: false,
                message: 'Group not found'
            });
        }
        res.json({
            success: true,
            message: 'Group updated successfully',
            data: group
        });
    } catch (error) {
        console.error('Error updating group:', error);
        res.status(400).json({
            success: false,
            message: 'Error updating group',
            error: error.message
        });
    }
};

// Delete group
export const deleteGroup = async (req, res) => {
    try {
        const group = await Group.deleteGroup(req.params.id);
        if (!group) {
            return res.status(404).json({
                success: false,
                message: 'Group not found'
            });
        }
        res.json({
            success: true,
            message: 'Group deleted successfully',
            data: group
        });
    } catch (error) {
        console.error('Error deleting group:', error);
        res.status(500).json({
            success: false,
            message: 'Error deleting group',
            error: error.message
        });
    }
};

// Deploy group
export const deployGroup = async (req, res) => {
    try {
        const group = await Group.load(req.params.id);
        if (!group) {
            return res.status(404).json({
                success: false,
                message: 'Group not found'
            });
        }
        
        const deployedGroup = await group.deploy();
        res.json({
            success: true,
            message: 'Group deployed successfully',
            data: deployedGroup
        });
    } catch (error) {
        console.error('Error deploying group:', error);
        res.status(500).json({
            success: false,
            message: 'Error deploying group',
            error: error.message
        });
    }
}; 