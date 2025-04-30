const Notification = require('../models/notification.model.js');
const mongoose = require('mongoose');

exports.getNotifications = async (req, res) => {
    try {
        const { _id } = req.user;
         console.log(_id,'_id');
        if (!mongoose.Types.ObjectId.isValid(_id)) {
            return res.status(400).json({ message: 'Invalid user ID' });
        }

        const notifications = await Notification.find()
            .populate('user')
            .sort({ createdAt: -1 });

         const filterData = notifications?.filter(notification => {
            console.log(notification.user._id.toString(), _id.toString(), 'notification.user._id.toString()');
            return notification.user && notification.user._id.toString() === _id.toString();
        });

        if (notifications.length === 0) {
            return res.status(404).json({ message: 'No notifications found for this user' });
        }

        res.status(200).json(filterData);
    } catch (error) {
        console.error('Error fetching notifications:', error);
        res.status(500).json({ message: 'Server error' });
    }
};
