const postgresql = {
    url: 'postgresql://rpdv:rpdvwin1064@localhost:5432/wrpdv' || process.env.DATABASE_URL
}

module.exports = {
    postgresql: postgresql
}