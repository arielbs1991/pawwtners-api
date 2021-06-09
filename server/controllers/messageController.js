const router = require('express').Router();
const authorize = require('../middlewares/authorize');
const helpers = require('../helpers/helpers');
const db = require('../models');
const sequelize = require('../models')
const Op = sequelize.Sequelize.Op;

/**
 * BASE URL FOR ALL ROUTES ON THIS PAGE: /api/message 
 */

router.get('/chathistory?:page?:limit?:chatId', /* authorize(), */ async (req, res) => {
    const { page, size } = req.query;
    const { limit, offset } = helpers.getPagination(page, size);

    //*! offset will be the number of messages to be loaded accoding to page.
    try {
        const messages = await db.Message.findAndCountAll({
            where: {
                chatId: req.query.chatId
            },
            limit,
            offset,
            order: [["id", "DESC"]]
        });
        data = helpers.getPagingData(messages, page, limit);

        const result = {
            messages: data.data,
            totalItems: data.totalItems,
            totalPages: data.totalPages,
            currentPage: data.currentPage,
            nextPage: data.nextPage,
            previousPage: data.previousPage
        }
        return res.json(result);
    } catch (error) {
        console.log(error)
        return res.status(500).send(error);
    }
})


router.get('/', authorize(), async (req, res) => {
    try {
        const user = await db.User.findOne({
            where: {
                id: req.userDetails.UserId
            },
            include: [
                {
                    model: db.Chat,
                    include: [
                        {
                            model: db.User,
                            attributes: ['id', 'photo', 'firstName', 'lastName'],
                            where: {
                                // Op not is a method of sequelize that stand here for include not what or do not include. In simple words that should not be included
                                [Op.not]: {
                                    id: req.userDetails.UserId
                                }
                            }
                        },
                        {
                            model: db.Message,
                            include: [
                                {
                                    model: db.User,
                                    attributes: ['id', 'photo', 'firstName', 'lastName'],
                                }
                            ],
                            limit: 20,
                            // DESC: Descending. That means here that message will be in descending order of id.
                            order: [["id", "DESC"]]
                        }
                    ]
                }
            ]
        });
        let result = {
            response_code: "E_SUCCESS",
            Chats: user.Chats
        }
        return res.json(result);
    } catch (err) {
        console.log(err)
        return res.status(500).end();

    }
});

router.post('/', authorize(), async (req, res) => {

    const user = await db.Message.create({
        message: req.body.message,
        chatId: req.body.chatId,
        date: +new Date(),
        fromUserId: req.body.UserId,
        unread: req.body.unread
    });
    return res.json(user.Chats);
});

module.exports = router