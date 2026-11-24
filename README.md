# Shivani Pathak | Portfolio

Personal portfolio website of **Shivani Pathak**, a third-year B.Tech Computer Science student in Pune focused on AI/ML and backend development. It is a single-page site built with plain HTML, CSS and JavaScript, with no frameworks and no build step.

**Live site:** [View the portfolio](https://6b05646cf3d9a5035d1d65c3--portfolio-cnsx.netlify.app)

## What's on the site

- **Hero:** animated headline with a drifting network graph of the tools I use and a spinning "work" badge
- **About:** a short statement that fills in as you scroll, plus quick facts
- **Services and Tools:** what I build, and the languages, frameworks and platforms I use
- **Featured projects:** CodeFlow, SmartMeasure, LeetTrack, Phishing Detection and an AI learning assistant, each with a preview image, stack, live demo and source link
- **Resume viewer:** a full-screen reader with open and download buttons
- **Contact:** a working message form, plus email and social links

## Animations and interactions

- Loading counter that slides away when the page is ready
- Line-by-line headline reveal and scroll-triggered fade-ins
- Colour wipe transition between sections when using the menu
- Interactive network graph in the hero that reacts to the mouse
- Hover effects on menu links, tool chips, project rows and buttons
- Live Pune time in the footer
- All motion switches off for visitors who have "reduce motion" enabled

## Tech

- HTML5, CSS3 (custom properties, grid, flexbox) and vanilla JavaScript
- Canvas API for the network graph
- [Web3Forms](https://web3forms.com) for the contact form
- Hosted on [Netlify](https://www.netlify.com)

## Project structure

```
.
├── index.html        # page structure and content
├── style.css         # all styling and animations
├── script.js         # animations, resume viewer, contact form
├── resumedata.js     # embedded copy of the resume PDF used by the viewer
├── images/           # project preview images
└── README.md
```

## Run it locally

1. Clone or download this repository.
2. Open `index.html` in a browser, or start a local server from the project folder:

   ```bash
   python -m http.server 8000
   ```

   then visit `http://localhost:8000`.

The contact form only sends messages when the page is served over `localhost` or from the live site. Opened directly as a file, it shows a fallback with Gmail and email-app links instead.

## Set up the contact form

1. Create a free access key at [web3forms.com](https://web3forms.com).
2. In the Web3Forms dashboard, add your site address (for example your Netlify domain) as the allowed website.
3. In `script.js`, paste the key into the empty `WEB3_KEY` value:

   ```js
   var WEB3_KEY = 'your-access-key';
   ```

## Deploy

**Netlify:** go to [app.netlify.com/drop](https://app.netlify.com/drop) and drag the whole project folder in, or connect this repository so every push redeploys.

**GitHub Pages:** open the repository's Settings, then Pages, set the source to the `main` branch and `/ (root)`, and save.

Whichever you use, upload all the files together (`index.html`, `style.css`, `script.js`, `resumedata.js` and the `images` folder), then hard-refresh with Ctrl+F5 to see changes.

## Customize

- **Text and links:** edit `index.html`. Search for the project names, the GitHub and LinkedIn links, and the email address.
- **Colours and fonts:** change the variables at the top of `style.css` (`--bg`, `--ink`, `--acc`, `--disp`, `--body`).
- **Project images:** replace the files in `images/` and keep the same file names, or update the image paths in `index.html`.
- **Resume:** update the resume text inside the viewer section of `index.html`, and regenerate `resumedata.js` from the new PDF.

## Contact

- GitHub: [shivanipathak5143-web](https://github.com/shivanipathak5143-web)
- LinkedIn: [shivani-pathak](https://www.linkedin.com/in/shivani-pathak-a5a009329/)
- Email: shivanipathak5143@gmail.com
