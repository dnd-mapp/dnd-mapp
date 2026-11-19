import{n as e}from"./rolldown-runtime-vtgMY1y5.js";import{N as t,P as n,c as r,n as i,s as a,x as o}from"./blocks-CDxrhzRn.js";import{i as s,n as c,r as l,t as u}from"./footer.stories-CetpkjG6.js";function _createMdxContent(e){let t={code:`code`,h1:`h1`,h2:`h2`,h3:`h3`,p:`p`,pre:`pre`,...n(),...e.components};return(0,d.jsxs)(d.Fragment,{children:[(0,d.jsx)(a,{of:l}),`
`,(0,d.jsx)(t.h1,{id:`footer`,children:`Footer`}),`
`,(0,d.jsx)(t.p,{children:`The bottom of every page: the brand, the columns of links, the license line, the SRD 5.1 attribution, the unofficial notice, and the Theme picker. It is the Footer component of the design system in Penpot.`}),`
`,(0,d.jsx)(i,{of:u}),`
`,(0,d.jsx)(t.h2,{id:`placing-a-footer`,children:`Placing a footer`}),`
`,(0,d.jsxs)(t.p,{children:[`Footer is an attribute on `,(0,d.jsx)(t.code,{children:`<footer>`}),`. Project each column as a `,(0,d.jsx)(t.code,{children:`<nav>`}),` around a Link group, named by the heading of the group:`]}),`
`,(0,d.jsx)(t.pre,{children:(0,d.jsx)(t.code,{className:`language-html`,children:`<footer dma-footer>
    <nav aria-labelledby="footer-product">
        <dma-link-group>
            <h2 id="footer-product">Product</h2>
            <li><a dma-link kind="quiet" routerLink="/compendium">Compendium</a></li>
            <li><a dma-link kind="quiet" routerLink="/dice">Dice</a></li>
        </dma-link-group>
    </nav>
    <nav aria-labelledby="footer-project">
        <dma-link-group>
            <h2 id="footer-project">Project</h2>
            <li><a dma-link kind="quiet" href="https://github.com/critsource/critsource">GitHub</a></li>
        </dma-link-group>
    </nav>
</footer>
`})}),`
`,(0,d.jsx)(t.p,{children:`The footer shows the columns in the order you project them, and drops any other content. The brand, the license line, the SRD 5.1 attribution, the unofficial notice, and the Theme picker are built in, so every page shows them the same. The license of the SRD 5.1 requires the attribution word for word, and the notice tells readers that D&D Mapp is not an official product, so no page can change or leave out either.`}),`
`,(0,d.jsx)(t.h2,{id:`viewport`,children:`Viewport`}),`
`,(0,d.jsxs)(t.p,{children:[`The layout follows the desktop breakpoint of `,(0,d.jsx)(t.code,{children:`@critsource/design-tokens`}),`, so the footer takes no input for it. Its inline padding follows the `,(0,d.jsx)(t.code,{children:`space.page-inline`}),` token: 120 px on Desktop, and 20 px on Mobile.`]}),`
`,(0,d.jsx)(t.h3,{id:`desktop`,children:`Desktop`}),`
`,(0,d.jsx)(t.p,{children:`From the breakpoint up, the brand sits at the start of the footer and the columns at its end, 48 px apart. Below a divider line, the legal text, at most 720 px wide, sits beside the Theme picker, as the top of this page shows.`}),`
`,(0,d.jsx)(t.h3,{id:`mobile`,children:`Mobile`}),`
`,(0,d.jsx)(t.p,{children:`Below the breakpoint, every part stacks in one column, with the columns 32 px apart, and the Theme picker fills the width of the footer.`}),`
`,(0,d.jsx)(i,{of:c,story:{inline:!1,height:`68rem`}}),`
`,(0,d.jsx)(t.h2,{id:`focus`,children:`Focus`}),`
`,(0,d.jsx)(t.p,{children:`The footer takes no focus itself. Its links draw their own hover and focus states, as the docs page of Link shows, and so do the options of the Theme picker. Penpot draws the two URLs of the attribution as plain text; the footer underlines them, so color is not the only cue that they are links, and draws the focus ring of Link around them.`}),`
`,(0,d.jsx)(t.h2,{id:`accessibility`,children:`Accessibility`}),`
`,(0,d.jsx)(t.p,{children:`The footer is the contentinfo landmark of the page, and each column a navigation landmark named by its heading. The logo names itself "D&D Mapp". The URLs of the attribution break anywhere, so they never widen a narrow screen.`}),`
`,(0,d.jsx)(t.h2,{id:`testing`,children:`Testing`}),`
`,(0,d.jsxs)(t.p,{children:[(0,d.jsx)(t.code,{children:`FooterHarness`}),` from `,(0,d.jsx)(t.code,{children:`@critsource/ui-web/testing`}),` reads a footer in a test: its logo, Theme picker, and link groups, its texts and their look, the links of the attribution, its own look, and the place and size of each part and column.`]})]})}function MDXContent(e={}){let{wrapper:t}={...n(),...e.components};return t?(0,d.jsx)(t,{...e,children:(0,d.jsx)(_createMdxContent,{...e})}):_createMdxContent(e)}var d;function init_footer(){return(init_footer=e((()=>{d=o(),t(),r(),s()})))()}init_footer();export{MDXContent as default};