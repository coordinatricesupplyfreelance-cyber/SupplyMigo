
const express = require('express')
const cors = require('cors')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')

const app = express()
app.use(cors())
app.use(express.json())

const users = []

app.post('/api/auth/register', async (req, res) => {
  const { email, password } = req.body
  const hashed = await bcrypt.hash(password, 10)
  users.push({ email, password: hashed })
  res.json({ message: 'Utilisateur créé' })
})

app.post('/api/auth/login', async (req, res) => {
  const { email, password } = req.body
  const user = users.find(u => u.email === email)
  if (!user) return res.status(401).json({ message: 'Utilisateur non trouvé' })

  const ok = await bcrypt.compare(password, user.password)
  if (!ok) return res.status(401).json({ message: 'Mot de passe incorrect' })

  const token = jwt.sign({ email }, 'logiapp_secret')
  res.json({ message: 'Connexion réussie', token })
})

app.listen(5000, () => console.log('Backend running on port 5000'))
