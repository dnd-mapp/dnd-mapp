import{n as e}from"./rolldown-runtime-vtgMY1y5.js";import{N as t,P as n,c as r,i,n as a,s as o,x as s}from"./blocks-CDxrhzRn.js";import{a as c,i as l,n as u,r as d,t as f}from"./card.stories-CNsXab1y.js";function _createMdxContent(e){let t={code:`code`,h1:`h1`,h2:`h2`,h3:`h3`,p:`p`,pre:`pre`,...n(),...e.components};return(0,p.jsxs)(p.Fragment,{children:[(0,p.jsx)(o,{of:l}),`
`,(0,p.jsx)(t.h1,{id:`card`,children:`Card`}),`
`,(0,p.jsx)(t.p,{children:`A block of related content, alone or in a grid, such as a tool on the landing page. It is the Card component of the design system in Penpot.`}),`
`,(0,p.jsx)(a,{of:d}),`
`,(0,p.jsx)(i,{of:d}),`
`,(0,p.jsx)(t.h2,{id:`placing-a-card`,children:`Placing a card`}),`
`,(0,p.jsxs)(t.p,{children:[`Card is an element that projects a heading as its title, a `,(0,p.jsx)(t.code,{children:`<p>`}),` as its text, each `,(0,p.jsx)(t.code,{children:`<dma-chip>`}),` as a chip, and an `,(0,p.jsx)(t.code,{children:`<a>`}),` as its action:`]}),`
`,(0,p.jsx)(t.pre,{children:(0,p.jsx)(t.code,{className:`language-html`,children:`<dma-card>
    <h3>Characters</h3>
    <p>Build character sheets and keep their spell books.</p>
    <dma-chip>Players</dma-chip>
    <dma-chip kind="dm">DM</dma-chip>
    <a dma-link kind="standalone" routerLink="/characters">Open your characters</a>
</dma-card>
`})}),`
`,(0,p.jsxs)(t.p,{children:[`Pick the heading level that fits the outline of the page, from `,(0,p.jsx)(t.code,{children:`<h1>`}),` to `,(0,p.jsx)(t.code,{children:`<h6>`}),`. The title draws the same at every level. The card draws its parts in the order above, whatever their order in the source, and drops any other content. Every part is optional, and a part the card does not project leaves no gap.`]}),`
`,(0,p.jsx)(t.p,{children:`The chips wrap onto as many rows as they need. Make the action a standalone Link, as Penpot draws it; the card keeps it as wide as its label.`}),`
`,(0,p.jsx)(t.p,{children:`The card fills its container, such as a column of a grid, and stays at least 280 px wide, so a grid wraps to fewer columns rather than squeezing them.`}),`
`,(0,p.jsx)(t.h2,{id:`a-grid-of-cards`,children:`A grid of cards`}),`
`,(0,p.jsxs)(t.p,{children:[`Place a grid of cards as a list, with each card in an `,(0,p.jsx)(t.code,{children:`<li>`}),` of its own, so assistive technology reads how many cards there are. Columns of `,(0,p.jsx)(t.code,{children:`repeat(auto-fill, minmax(var(--size-card-min), 1fr))`}),` wrap to fewer columns as the grid narrows, and `,(0,p.jsx)(t.code,{children:`display: grid`}),` on each `,(0,p.jsx)(t.code,{children:`<li>`}),` stretches its card to the height of its row. Set `,(0,p.jsx)(t.code,{children:`role="list"`}),` on a list that drops its markers, since Safari drops its list role otherwise.`]}),`
`,(0,p.jsx)(t.pre,{children:(0,p.jsx)(t.code,{className:`language-html`,children:`<ul class="cards" role="list">
    <li>
        <dma-card>
            <h3>Characters</h3>
            <p>Build character sheets and keep their spell books.</p>
        </dma-card>
    </li>
</ul>
`})}),`
`,(0,p.jsx)(a,{of:f}),`
`,(0,p.jsx)(t.h2,{id:`background`,children:`Background`}),`
`,(0,p.jsxs)(t.p,{children:[(0,p.jsx)(t.code,{children:`background`}),` picks what the card fills itself with, by what it sits on, so the card always stands one step above its background. An unknown value draws the default.`]}),`
`,(0,p.jsx)(t.h3,{id:`surface`,children:`Surface`}),`
`,(0,p.jsxs)(t.p,{children:[(0,p.jsx)(t.code,{children:`CardBackground.Surface`}),`, the default, is for a card on the page background, as the card at the top of this page shows.`]}),`
`,(0,p.jsx)(t.h3,{id:`raised`,children:`Raised`}),`
`,(0,p.jsxs)(t.p,{children:[(0,p.jsx)(t.code,{children:`CardBackground.Raised`}),` is for a card on a surface, such as a section that fills itself with the surface background.`]}),`
`,(0,p.jsx)(t.pre,{children:(0,p.jsx)(t.code,{className:`language-html`,children:`<dma-card background="raised">
    <h3>Characters</h3>
    <p>Build character sheets and keep their spell books.</p>
</dma-card>
`})}),`
`,(0,p.jsx)(a,{of:u}),`
`,(0,p.jsx)(t.h2,{id:`focus`,children:`Focus`}),`
`,(0,p.jsx)(t.p,{children:`A card takes no focus, and Penpot draws no hover or focus state for it, since it is not clickable as a whole. Its action is the target, and draws its own hover and focus states.`}),`
`,(0,p.jsx)(t.h2,{id:`accessibility`,children:`Accessibility`}),`
`,(0,p.jsx)(t.p,{children:`Assistive technology reads the title at the level you pick, then the text, the chips, and the action, in the order the card draws them. The card adds no role of its own, and the chips are no list, so their labels read as part of the card.`}),`
`,(0,p.jsx)(t.h2,{id:`testing`,children:`Testing`}),`
`,(0,p.jsxs)(t.p,{children:[(0,p.jsx)(t.code,{children:`CardHarness`}),` from `,(0,p.jsx)(t.code,{children:`@critsource/ui-web/testing`}),` reads a card in a test: the text, look, and place of each part, the order of its parts, its chips and action as a `,(0,p.jsx)(t.code,{children:`ChipHarness`}),` and a `,(0,p.jsx)(t.code,{children:`LinkHarness`}),`, the place of each chip, the look of its box, its size, and whether it has focus.`]})]})}function MDXContent(e={}){let{wrapper:t}={...n(),...e.components};return t?(0,p.jsx)(t,{...e,children:(0,p.jsx)(_createMdxContent,{...e})}):_createMdxContent(e)}var p;function init_card(){return(init_card=e((()=>{p=s(),t(),r(),c()})))()}init_card();export{MDXContent as default};