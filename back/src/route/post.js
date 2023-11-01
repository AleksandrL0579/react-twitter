// Підключаємо роутер до бек-енду
const express = require('express')
const router = express.Router()

const { Post } = require('../class/post')

//====================================================================================================

router.post('/post-create', (req, res) => {
  try {
    const { username, text, postId } = req.body
    console.log(username, text, postId)
    if (!username || !text) {
      return res
        .status(400)
        .json({
          message:
            'Потрібно передати всі данні для створення поста',
        })
    }

    let post = null
    console.log(postId, 'postId')

    if (postId) {
      post = Post.getById(postId)
      console.log(post, 'post')

      if (!post) {
        return res
          .status(400)
          .json({ message: 'Пост з таким ID не існує' })
      }
    }
    const newPost = Post.create(username, text, post)
    return res.status(200).json({
      post: {
        id: newPost.id,
        text: newPost.text,
        username: newPost.username,
        date: newPost.date,
      },
    })
  } catch (error) {
    return res.status(400).json({ message: error.message })
  }
})

//====================================================================================================

router.get('/post-list', (req, res) => {
  try {
    const list = Post.getList()

    if (list.length === 0) {
      return res.status(200).json({
        list: [],
      })
    }

    return res.status(200).json({
      list: list.map(({ id, username, date, text }) => ({
        id,
        username,
        text,
        date,
      })),
    })
  } catch (error) {
    res.status(400).json({
      message: error.message,
    })
  }
})

//====================================================================================================

router.get('/post-item', (req, res) => {
  try {
    const id = req.query.id

    if (!id) {
      return res.status(400).json({
        message: 'Полтрібно передати ID поста',
      })
    }

    const post = Post.getById(Number(id))

    if (!post) {
      return res.status(400).json({
        message: 'Пост з таким ID не існує',
      })
    }

    return res.status(200).json({
      post: {
        id: post.id,
        text: post.text,
        username: post.username,
        date: post.date,

        reply: post.reply.map((reply) => ({
          id: reply.id,
          text: reply.text,
          username: reply.username,
          date: reply.date,
        })),
      },
    })
  } catch (error) {
    res.status(400).json({
      message: error.message,
    })
  }
})
// Експортуємо глобальний роутер
module.exports = router
