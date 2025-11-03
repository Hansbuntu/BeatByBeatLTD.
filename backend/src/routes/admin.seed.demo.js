import { Router } from 'express'
import { requireAuth } from '../middleware/auth.js'
import Artist from '../models/Artist.js'
import Post from '../models/Post.js'
import Product from '../models/Product.js'

const router = Router()

router.post('/seed-demo', requireAuth, async (req, res) => {
  try {
    if (!['admin', 'editor'].includes(req.user.role)) return res.status(403).json({ error: 'Forbidden' })

    // simple, idempotent-ish insertions using upsert by slug/title
    const artists = [
      { name: 'BBBLTD Collective', slug: 'bbb-collective', bio: 'Label collective.', avatarUrl: 'https://picsum.photos/seed/bbb/300/300', socials: { instagram: 'bbb.collective' } },
      { name: 'DJ Waves', slug: 'dj-waves', bio: 'Deep house producer.', avatarUrl: 'https://picsum.photos/seed/waves/300/300', socials: { instagram: 'djwaves' } },
      { name: 'Araa', slug: 'araa', bio: 'Alt/afro fusion.', avatarUrl: 'https://picsum.photos/seed/araa/300/300' },
    ]
    const artistDocs = []
    for (const a of artists) {
      const doc = await Artist.findOneAndUpdate({ slug: a.slug }, a, { new: true, upsert: true })
      artistDocs.push(doc)
    }

    const demoCovers = [
      'https://picsum.photos/seed/c1/1200/800',
      'https://picsum.photos/seed/c2/1200/800',
      'https://picsum.photos/seed/c3/1200/800',
      'https://picsum.photos/seed/c4/1200/800',
    ]
    const demoAudio = [
      'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3',
      'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3',
      'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-3.mp3',
    ]

    const posts = [
      { title: 'Exclusive: Sunrise Groove', slug: 'exclusive-sunrise-groove', excerpt: 'House cut for the morning.', contentMd: '### Sunrise Groove\n\nExclusive preview.', tags: ['exclusive','house'], artist: artistDocs[1]._id, coverImageUrl: demoCovers[0], audioUrl: demoAudio[0], featured: true },
      { title: 'Label News', slug: 'label-news', excerpt: 'What is new at the label.', contentMd: 'Updates and more.', tags: ['news'], artist: artistDocs[0]._id, coverImageUrl: demoCovers[1] },
      { title: 'Araa Drops', slug: 'araa-drops', excerpt: 'Alt vibes.', contentMd: 'Listen now.', tags: ['release'], artist: artistDocs[2]._id, coverImageUrl: demoCovers[2], audioUrl: demoAudio[1] },
    ]
    for (const p of posts) {
      await Post.findOneAndUpdate({ slug: p.slug }, p, { upsert: true })
    }

    const products = [
      { title: 'Sunrise Groove (Exclusive)', slug: 'sunrise-groove-exclusive', description: 'Exclusive single.', coverImageUrl: demoCovers[0], audioPreviewUrl: demoAudio[0], price: { amount: 49, currency: 'GHS' }, exclusivity: 'exclusive', artist: artistDocs[1]._id, published: true },
      { title: 'Araa Alt Pack', slug: 'araa-alt-pack', description: '3-track pack.', coverImageUrl: demoCovers[2], audioPreviewUrl: demoAudio[2], price: { amount: 79, currency: 'GHS' }, exclusivity: 'limited', artist: artistDocs[2]._id, published: true },
      { title: 'Label Sampler', slug: 'label-sampler', description: 'Sampler compilation.', coverImageUrl: demoCovers[3], price: { amount: 0, currency: 'GHS' }, exclusivity: 'open', artist: artistDocs[0]._id, published: true },
    ]
    for (const pr of products) {
      await Product.findOneAndUpdate({ slug: pr.slug }, pr, { upsert: true })
    }

    res.json({ ok: true })
  } catch (e) {
    res.status(400).json({ error: 'Failed to seed demo' })
  }
})

export default router


