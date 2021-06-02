const router = require('express').Router();
const authorize = require('../middlewares/authorize');
const helpers = require('../helpers/helpers');
const db = require('../models');

//BASE URL FOR ALL ROUTES ON THIS PAGE: /api/message

router.get('/:?page:?limit', authorize(), async (req, res) => {
    const { page, size } = req.query;
    const { limit, offset } = helpers.getPagination(page, size);

    //*! offset will be the number of messages to be loaded accoding to page.
    try {
        const messages = await db.Message.findAndCountAll({
            where: {
                from: req.userDetails.UserId
            },
            limit,
            offset,
            order: [["date", "DESC"]]
        });
        data = helpers.getPagingData(messages, page, limit);

        const result = {
            messages: data.rows,
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



module.exports = router