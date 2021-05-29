const router = require('express').Router();
const db = require('../models');

// BASE URL FOR ALL ROUTES ON THIS PAGE: /api/like /

//tested+
router.post('/', async (req, res) => {
    try {

        let dblike = await db.Like.findOne({
            where: {
                likedUserId: req.body.likedUserId,
                UserId: req.session.user.UserId
            }
        })

        if (!dblike) {

            await db.Like.create({
                isLiked: req.body.isLiked,
                likedUserId: req.body.likedUserId,
                UserId: req.session.user.UserId
            })

            if (req.body.isLiked == true) {
                let userLike = await db.Like.findOne({
                    where: {
                        isLiked: true,
                        likedUserId: req.session.user.UserId,
                        UserId: req.body.likedUserId
                    }
                })
                if (userLike) {
                    let match = await db.Match.findOne({
                        where: {
                            isLiked: true,
                            matchedUserId: req.session.user.UserId,
                            UserId: req.body.likedUserId
                        }
                    })
                    let match1 = await db.Match.findOne({
                        where: {
                            isLiked: true,
                            matchedUserId: req.body.likedUserId,
                            UserId: req.session.user.UserId
                        }
                    })
                    if (!match && !match1) {
                        await db.Match.create({
                            isLiked: true,
                            matchedUserId: req.body.likedUserId,
                            UserId: req.session.user.UserId

                        })

                        await db.Match.create({
                            isLiked: true,
                            matchedUserId: req.session.user.UserId,
                            UserId: req.body.likedUserId
                        })
                    }
                    return res.json({
                        response_code: '1'
                    });
                }
            }
        } else {
            await db.Like.update({
                isLiked: req.body.isLiked,
                likedUserId: req.body.likedUserId,
                UserId: req.session.user.UserId
            }, {
                where: {
                    likedUserId: req.body.likedUserId, UserId: req.session.user.UserId
                }
            })

            if (req.body.isLiked == true) {
                let userLike = await db.Like.findOne({
                    where: {
                        isLiked: true,
                        likedUserId: req.session.user.UserId,
                        UserId: req.body.likedUserId
                    }
                })
                if (userLike) {
                    let match = await db.Match.findOne({
                        where: {
                            isLiked: true,
                            matchedUserId: req.session.user.UserId,
                            UserId: req.body.likedUserId
                        }
                    })
                    let match1 = await db.Match.findOne({
                        where: {
                            isLiked: true,
                            matchedUserId: req.body.likedUserId,
                            UserId: req.session.user.UserId
                        }
                    })
                    if (!match && !match1) {
                        await db.Match.create({
                            isLiked: true,
                            matchedUserId: req.body.likedUserId,
                            UserId: req.session.user.UserId

                        })

                        await db.Match.create({
                            isLiked: true,
                            matchedUserId: req.session.user.UserId,
                            UserId: req.body.likedUserId
                        })
                    }
                }
                return res.json({
                    response_code: '1'
                });
            } else if (req.body.isLiked == false) {
                let match = await db.Match.findOne({
                    where: {
                        isLiked: true,
                        matchedUserId: req.session.user.UserId,
                        UserId: req.body.likedUserId
                    }
                })
                if (match) {
                    let match1 = await db.Match.findOne({
                        where: {
                            isLiked: true,
                            matchedUserId: req.body.likedUserId,
                            UserId: req.session.user.UserId
                        }
                    })
                    if (match && match1) {
                        await db.Match.destroy({
                            where: {
                                isLiked: true,
                                matchedUserId: req.body.likedUserId,
                                UserId: req.session.user.UserId
                            }

                        })
                        await db.Match.destroy({
                            where: {
                                isLiked: true,
                                matchedUserId: req.session.user.UserId,
                                UserId: req.body.likedUserId
                            }
                        })
                    }
                }

                return res.json({
                    response_code: '1'
                });
            }
        }
        return res.json({
            response_code: '1'
        });
    } catch (error) {
        console.log(error);
        return res.status(500).end();
    }
})

module.exports = router;