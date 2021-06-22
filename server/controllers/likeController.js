const router = require('express').Router();
const authorize = require('../middlewares/authorize');
const db = require('../models');

// BASE URL FOR ALL ROUTES ON THIS PAGE: /api/like /

//tested+
router.post('/', authorize(), async (req, res) => {
    try {

        let dblike = await db.Like.findOne({
            where: {
                likedUserId: req.body.likedUserId,
                UserId: req.userDetails.UserId
            }
        })

        if (!dblike) {

            await db.Like.create({
                isLiked: req.body.isLiked,
                likedUserId: req.body.likedUserId,
                UserId: req.userDetails.UserId
            })

            if (req.body.isLiked == true) {
                let userLike = await db.Like.findOne({
                    where: {
                        isLiked: true,
                        likedUserId: req.userDetails.UserId,
                        UserId: req.body.likedUserId
                    }
                })
                if (userLike) {
                    let match = await db.Match.findOne({
                        where: {
                            isLiked: true,
                            matchedUserId: req.userDetails.UserId,
                            UserId: req.body.likedUserId
                        }
                    })
                    let match1 = await db.Match.findOne({
                        where: {
                            isLiked: true,
                            matchedUserId: req.body.likedUserId,
                            UserId: req.userDetails.UserId
                        }
                    })
                    if (!match && !match1) {
                        await db.Match.create({
                            isLiked: true,
                            matchedUserId: req.body.likedUserId,
                            UserId: req.userDetails.UserId

                        })

                        await db.Match.create({
                            isLiked: true,
                            matchedUserId: req.userDetails.UserId,
                            UserId: req.body.likedUserId
                        })

                        const user = await db.User.findOne({
                            where: {
                                id: req.userDetails.UserId
                            },
                            include: [
                                {
                                    model: db.Chat,
                                    where: {
                                        type: "dual"
                                    },
                                    include: [
                                        {
                                            model: db.ChatUser,
                                            where: {
                                                userId: req.body.likedUserId
                                            }
                                        }
                                    ]
                                }
                            ]
                        });
                        if (user && user.Chats.length > 0)
                            return res.json({
                                response_code: "E_SUCCESS"
                            });

                        const chat = await db.Chat.create({ type: 'dual' });

                        let data = await db.ChatUser.bulkCreate([
                            {
                                chatId: chat.id,
                                userId: req.userDetails.UserId
                            },
                            {
                                chatId: chat.id,
                                userId: req.body.likedUserId
                            }
                        ]);
                        console.log(data)

                    }
                    return res.json({
                        response_code: "E_SUCCESS"
                    });
                }
            }
        } else {
            await db.Like.update({
                isLiked: req.body.isLiked,
                likedUserId: req.body.likedUserId,
                UserId: req.userDetails.UserId
            }, {
                where: {
                    likedUserId: req.body.likedUserId, UserId: req.userDetails.UserId
                }
            })

            if (req.body.isLiked == true) {
                let userLike = await db.Like.findOne({
                    where: {
                        isLiked: true,
                        likedUserId: req.userDetails.UserId,
                        UserId: req.body.likedUserId
                    }
                })
                if (userLike) {
                    let match = await db.Match.findOne({
                        where: {
                            isLiked: true,
                            matchedUserId: req.userDetails.UserId,
                            UserId: req.body.likedUserId
                        }
                    })
                    let match1 = await db.Match.findOne({
                        where: {
                            isLiked: true,
                            matchedUserId: req.body.likedUserId,
                            UserId: req.userDetails.UserId
                        }
                    })
                    if (!match && !match1) {
                        await db.Match.create({
                            isLiked: true,
                            matchedUserId: req.body.likedUserId,
                            UserId: req.userDetails.UserId

                        })

                        await db.Match.create({
                            isLiked: true,
                            matchedUserId: req.userDetails.UserId,
                            UserId: req.body.likedUserId
                        })

                        const user = await db.User.findOne({
                            where: {
                                id: req.userDetails.UserId
                            },
                            include: [
                                {
                                    model: db.Chat,
                                    where: {
                                        type: "dual"
                                    },
                                    include: [
                                        {
                                            model: db.ChatUser,
                                            where: {
                                                userId: req.body.likedUserId
                                            }
                                        }
                                    ]
                                }
                            ]
                        });
                        if (user && user.Chats.length > 0)
                            return res.status(403).json({ status: "Error", message: "Chat with this User already exists" });

                        const chat = await db.Chat.create({ type: 'dual' });

                        let data = await db.ChatUser.bulkCreate([
                            {
                                chatId: chat.id,
                                userId: req.userDetails.UserId
                            },
                            {
                                chatId: chat.id,
                                userId: req.body.likedUserId
                            }
                        ]);
                        console.log(data)
                    }
                }
                return res.json({
                    response_code: "E_SUCCESS"
                });
            } else if (req.body.isLiked == false) {
                let match = await db.Match.findOne({
                    where: {
                        isLiked: true,
                        matchedUserId: req.userDetails.UserId,
                        UserId: req.body.likedUserId
                    }
                })
                if (match) {
                    let match1 = await db.Match.findOne({
                        where: {
                            isLiked: true,
                            matchedUserId: req.body.likedUserId,
                            UserId: req.userDetails.UserId
                        }
                    })
                    if (match && match1) {
                        await db.Match.destroy({
                            where: {
                                isLiked: true,
                                matchedUserId: req.body.likedUserId,
                                UserId: req.userDetails.UserId
                            }

                        })
                        await db.Match.destroy({
                            where: {
                                isLiked: true,
                                matchedUserId: req.userDetails.UserId,
                                UserId: req.body.likedUserId
                            }
                        })
                    }
                }

                return res.json({
                    response_code: "E_SUCCESS"
                });
            }
        }
        return res.json({
            response_code: "E_SUCCESS"
        });
    } catch (error) {
        console.log(error);
        return res.status(500).end();
    }
})

module.exports = router;