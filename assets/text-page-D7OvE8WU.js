import{n as e}from"./rolldown-runtime-vtgMY1y5.js";import{N as t,P as n,c as r,n as i,s as a,x as o}from"./blocks-CDxrhzRn.js";import{a as s,i as c,n as l,o as u,r as d,t as f}from"./text-page.stories-DMSxssUk.js";function _createMdxContent(e){let t={code:`code`,h1:`h1`,h2:`h2`,h3:`h3`,li:`li`,p:`p`,pre:`pre`,strong:`strong`,ul:`ul`,...n(),...e.components};return(0,p.jsxs)(p.Fragment,{children:[(0,p.jsx)(a,{of:u}),`
`,(0,p.jsx)(t.h1,{id:`text-page`,children:`Text page`}),`
`,(0,p.jsx)(t.p,{children:`The article of a long text page, such as Privacy or Accessibility: a title, the date it was last updated, and the prose, with an optional Summary and On this page. It is the Article of the Text page layout of the design system in Penpot.`}),`
`,(0,p.jsx)(i,{of:f}),`
`,(0,p.jsx)(t.h2,{id:`placing-a-text-page`,children:`Placing a text page`}),`
`,(0,p.jsxs)(t.p,{children:[`Text page is an attribute on `,(0,p.jsx)(t.code,{children:`<article>`}),`. Project a `,(0,p.jsx)(t.code,{children:`<header>`}),` with the title of the page as its `,(0,p.jsx)(t.code,{children:`<h1>`}),` and the date as a `,(0,p.jsx)(t.code,{children:`<p>`}),`, then the prose as plain HTML. Add On this page and a Summary when the page needs them:`]}),`
`,(0,p.jsx)(t.pre,{children:(0,p.jsx)(t.code,{className:`language-html`,children:`<main>
    <article dma-text-page>
        <header>
            <h1>Privacy</h1>
            <p>Last updated <time datetime="2026-11-11">November 11, 2026</time></p>
        </header>
        <nav dma-on-this-page>
            <li><a dma-on-this-page-link href="#who-is-responsible">Who is responsible</a></li>
        </nav>
        <section dma-summary>
            <h2 dma-summary-title>In short</h2>
            <ul role="list">
                <li>...</li>
            </ul>
        </section>
        <h2 id="who-is-responsible">Who is responsible</h2>
        <p>...</p>
        <h3 id="contact">Contact</h3>
        <p>Write to the <a dma-link href="mailto:...">support address</a>.</p>
        <ul role="list">
            <li>...</li>
        </ul>
    </article>
</main>
`})}),`
`,(0,p.jsx)(t.p,{children:`The article draws the header first, then On this page, the Summary, and the prose, whatever order the page writes them in, 48 px apart. It fills its container up to the measure, 720 px, and leaves its own place on the page, such as the padding of the main area, to the page that holds it. Header and Footer belong to the app shell, not to the article.`}),`
`,(0,p.jsx)(t.h2,{id:`title-block`,children:`Title block`}),`
`,(0,p.jsxs)(t.p,{children:[`The title draws the h1 typography in the default foreground color, and the date draws the small body typography in the muted color, 12 px below the title. Put the date in a `,(0,p.jsx)(t.code,{children:`<time>`}),` with a `,(0,p.jsx)(t.code,{children:`datetime`}),` attribute, so machines read it as well as people.`]}),`
`,(0,p.jsx)(t.h2,{id:`prose`,children:`Prose`}),`
`,(0,p.jsx)(t.p,{children:`The prose styles apply to the elements the article projects, so a page writes its text with no classes or wrappers. Each element draws in the default foreground color:`}),`
`,(0,p.jsxs)(t.ul,{children:[`
`,(0,p.jsxs)(t.li,{children:[(0,p.jsx)(t.strong,{children:(0,p.jsx)(t.code,{children:`<h2>`})}),` draws the h3 typography, 40 px below the element before it.`]}),`
`,(0,p.jsxs)(t.li,{children:[(0,p.jsx)(t.strong,{children:(0,p.jsx)(t.code,{children:`<h3>`})}),` draws the title typography, 24 px below the element before it.`]}),`
`,(0,p.jsxs)(t.li,{children:[(0,p.jsx)(t.strong,{children:(0,p.jsx)(t.code,{children:`<p>`})}),` draws the body typography, 16 px below the element before it.`]}),`
`,(0,p.jsxs)(t.li,{children:[(0,p.jsxs)(t.strong,{children:[(0,p.jsx)(t.code,{children:`<ul>`}),` and `,(0,p.jsx)(t.code,{children:`<ol>`})]}),` draw their items in the body typography, 8 px apart, 16 px below the element before them.`]}),`
`]}),`
`,(0,p.jsx)(t.p,{children:`An h2 draws the h3 typography, since the h2 typography is too heavy under the title of the page in long text. The first element of the prose takes no space above, and the article drops the margins of the elements, so these spaces are the only ones.`}),`
`,(0,p.jsx)(t.h3,{id:`lists`,children:`Lists`}),`
`,(0,p.jsxs)(t.p,{children:[`Each item of a `,(0,p.jsx)(t.code,{children:`<ul>`}),` starts with a bullet, and each item of an `,(0,p.jsx)(t.code,{children:`<ol>`}),` with its number, in the muted color, 12 px before its text. A wrapped line starts under the text, not under the marker. The items draw their own markers, so the lists drop the ones of their elements, which makes Safari drop their list role: give each list `,(0,p.jsx)(t.code,{children:`role="list"`}),`.`]}),`
`,(0,p.jsx)(t.h3,{id:`links`,children:`Links`}),`
`,(0,p.jsxs)(t.p,{children:[`Place a link in the prose as an inline Link, `,(0,p.jsx)(t.code,{children:`<a dma-link>`}),`, which draws its own color and underline. Text page adds no styles to links.`]}),`
`,(0,p.jsx)(t.h2,{id:`summary-and-on-this-page`,children:`Summary and On this page`}),`
`,(0,p.jsx)(t.p,{children:`A Summary sits between the title block and the prose, 48 px from each, as wide as the prose. On this page links to the sections of the prose. From the desktop breakpoint up, it takes a column of its own, 240 px wide and 64 px beside the rest, from the top of the article. It sticks there while the article scrolls, and the article grows by its column, to 1024 px:`}),`
`,(0,p.jsx)(i,{of:d}),`
`,(0,p.jsx)(t.p,{children:`Below the breakpoint, On this page sits under the title block, in a closed Disclosure, and the Summary under it:`}),`
`,(0,p.jsx)(i,{of:c}),`
`,(0,p.jsx)(t.p,{children:`Either can be left out. Without On this page, the article stays at the measure in both viewports.`}),`
`,(0,p.jsx)(t.h2,{id:`viewport`,children:`Viewport`}),`
`,(0,p.jsx)(t.p,{children:`The sizes of the title and the section headings follow the Viewport tokens, so the article needs no input for the viewport. Below the desktop breakpoint, the title is 34 px and an h2 24 px; from the breakpoint up, they grow to 54 px and 28 px.`}),`
`,(0,p.jsx)(i,{of:l}),`
`,(0,p.jsx)(t.h2,{id:`focus`,children:`Focus`}),`
`,(0,p.jsx)(t.p,{children:`A text page takes no focus, and Penpot draws no hover or focus state for it, since it is not interactive. The links in its prose take focus and draw the focus ring of Link.`}),`
`,(0,p.jsx)(t.h2,{id:`accessibility`,children:`Accessibility`}),`
`,(0,p.jsxs)(t.p,{children:[`Place the article in the `,(0,p.jsx)(t.code,{children:`<main>`}),` of the page, and keep its title the only `,(0,p.jsx)(t.code,{children:`<h1>`}),` of the page. The headings of the prose keep the levels the page writes, so the outline of the page follows its sections: an h2 for each section, and an h3 for each subsection. A `,(0,p.jsx)(t.code,{children:`<header>`}),` inside an article is not a banner landmark, so it adds nothing to the landmarks of the page. On this page comes before the Summary and the prose in the DOM, as the article draws it on Mobile, so the tab order follows what the reader sees. Screen readers skip the markers the lists draw, since the list role tells them where each item starts.`]}),`
`,(0,p.jsx)(t.h2,{id:`testing`,children:`Testing`}),`
`,(0,p.jsxs)(t.p,{children:[(0,p.jsx)(t.code,{children:`TextPageHarness`}),` from `,(0,p.jsx)(t.code,{children:`@critsource/ui-web/testing`}),` reads a text page in a test: the text of its title and date, the `,(0,p.jsx)(t.code,{children:`datetime`}),` of the date, the tag and text of each element of the prose, how each draws its text, where each sits, the text and place of each list item, where On this page and the Summary sit, and the width of the article.`]})]})}function MDXContent(e={}){let{wrapper:t}={...n(),...e.components};return t?(0,p.jsx)(t,{...e,children:(0,p.jsx)(_createMdxContent,{...e})}):_createMdxContent(e)}var p;function init_text_page(){return(init_text_page=e((()=>{p=o(),t(),r(),s()})))()}init_text_page();export{MDXContent as default};