const express = require("express");
const morgan = require("morgan");
const postBank = require('./postBank');

const app = express();

app.use(morgan('dev'));

app.use(express.static('public'));

app.get("/", (req, res) => {
  const posts = postBank.list();

  const html = `
    <DOCTYPE html>
      <html>
        <head>
          <title> Wizard News </title>
          <link rel="stylesheet" href="/style.css" />
        </head>
        <body>
          <div class="news-list">
          <header><img src="/logo.png"/>Wizard News</header>
          ${posts.map(post => `
             <div class='news-item'>
                <p>
                  <span class="news-position">${post.id}. ▲</span>
                  <a href="/posts/${post.id}"> ${post.title} </a>
                  <small>(by ${post.name})</small>
                </p>
                <small class="news-info">
                  ${post.upvotes} upvotes | ${post.date}
                </small>
             </div>`
           ).join('')}
          </div>
        </body>
      </html>`
  res.send(html);
});
app.get('/posts/:id', (req, res) => {
  const id = req.params.id;
  const post = postBank.find(id);
  console.log("this is running", post.id);
  if (!post.id) {
    throw new Error('Not Found');
  }
  const html = `
  <DOCTYPE html>
      <html>
        <head>
          <title> Wizard News </title>
          <link rel="stylesheet" href="/style.css" />
        </head>
        <body>
          <div class="news-list">
          <header><img src="/logo.png"/>Wizard News</header>
             <div class='news-item'>
                <p>
                  <span class="news-position">${post.id}. ▲</span>
                  ${post.title}
                  <small>(by ${post.name})</small>
                </p>
                <small class="news-info">
                  ${post.content} | ${post.date}
                </small>
                <br>
             <a href="/">Click Here to Go Home</a>
             </div>
          </div>
        </body>
      </html>`
  res.send(html);
});
app.use((err, req, res, next) => {
  console.error(err);
  console.log("this is the error", err);
    next(err);
    res.status(404).send(
      `<!DOCTYPE html>
      <html>
      <head>
        <title>Wizard News</title>
        <link rel="stylesheet" href="/style.css" />
      </head>
      <body>
        <div class="news-list">
          <header><img src="/logo.png"/>Wizard News</header>
            <div class='news-item'>
              <p>Page Not Found!</p>
              <br>
              <a href="/">Click Here to Go Home</a>
            </div>
        </div>
      </body>
      </html>`
    );
});
const PORT = 1337;
app.listen(PORT, () => {
  console.log(`App listening in port ${PORT}`);
});