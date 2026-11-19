import{n as e}from"./rolldown-runtime-vtgMY1y5.js";import{N as t,P as n,c as r,n as i,s as a,x as o}from"./blocks-CDxrhzRn.js";import{a as s,i as c,n as l,r as u,t as d}from"./summary.stories-CqBQhBZD.js";function _createMdxContent(e){let t={code:`code`,h1:`h1`,h2:`h2`,h3:`h3`,p:`p`,pre:`pre`,...n(),...e.components};return(0,f.jsxs)(f.Fragment,{children:[(0,f.jsx)(a,{of:s}),`
`,(0,f.jsx)(t.h1,{id:`summary`,children:`Summary`}),`
`,(0,f.jsx)(t.p,{children:`The box that opens a long text page with a short version of it, such as In short on the Privacy page and At a glance on the Accessibility page. It is the Summary component of the design system in Penpot.`}),`
`,(0,f.jsx)(i,{of:u}),`
`,(0,f.jsx)(t.h2,{id:`placing-a-summary`,children:`Placing a summary`}),`
`,(0,f.jsxs)(t.p,{children:[`Summary is an attribute on `,(0,f.jsx)(t.code,{children:`<section>`}),`. Project a heading with `,(0,f.jsx)(t.code,{children:`dma-summary-title`}),` as its title, then a `,(0,f.jsx)(t.code,{children:`<ul role="list">`}),` of its points:`]}),`
`,(0,f.jsx)(t.pre,{children:(0,f.jsx)(t.code,{className:`language-html`,children:`<section dma-summary>
    <h2 dma-summary-title>In short</h2>
    <ul role="list">
        <li>No accounts, no cookies, no analytics, and no ads.</li>
        <li>Your theme choice stays in your browser and never reaches us.</li>
    </ul>
</section>
`})}),`
`,(0,f.jsx)(t.p,{children:`Each point draws a muted marker 12 px before its text, and a line that wraps starts under the text. The points sit 8 px apart.`}),`
`,(0,f.jsx)(t.h3,{id:`with-a-facts-list`,children:`With a Facts list`}),`
`,(0,f.jsx)(t.p,{children:`Project a Facts list in place of the points, as At a glance on the Accessibility page does. The summary spaces it 12 px below the title, and it fills the box:`}),`
`,(0,f.jsx)(t.pre,{children:(0,f.jsx)(t.code,{className:`language-html`,children:`<section dma-summary>
    <h2 dma-summary-title>At a glance</h2>
    <dl dma-facts-list>
        <div>
            <dt>Standard</dt>
            <dd>WCAG 2.2, level AA</dd>
        </div>
    </dl>
</section>
`})}),`
`,(0,f.jsx)(i,{of:d}),`
`,(0,f.jsx)(t.p,{children:`Below the desktop breakpoint, the Facts list stacks each term above its value by itself:`}),`
`,(0,f.jsx)(i,{of:l,story:{inline:!1,height:`24rem`}}),`
`,(0,f.jsxs)(t.p,{children:[`Make the title an `,(0,f.jsx)(t.code,{children:`<h2>`}),` under the title of the page, so the summary shows in the headings list of a screen reader. The title draws the same at every level.`]}),`
`,(0,f.jsx)(t.p,{children:`Place the summary under the title block of the page. It fills its container up to the measure, 720 px, and leaves its own place in the container to the page that holds it. Penpot draws it the same in both viewports, so it takes no input for them.`}),`
`,(0,f.jsx)(t.h2,{id:`focus`,children:`Focus`}),`
`,(0,f.jsx)(t.p,{children:`A summary takes no focus, and Penpot draws no hover or focus state for it, since it is not interactive. A Link in a point draws its own focus ring.`}),`
`,(0,f.jsx)(t.h2,{id:`accessibility`,children:`Accessibility`}),`
`,(0,f.jsxs)(t.p,{children:[`The title names the section, so assistive technology announces the summary as a region by that name. The points drop the markers of their list, which makes Safari drop its list role, so give the `,(0,f.jsx)(t.code,{children:`<ul>`}),` `,(0,f.jsx)(t.code,{children:`role="list"`}),`. Screen readers skip the markers the summary draws. The title binds an id, generated unless you set one, and the section points `,(0,f.jsx)(t.code,{children:`aria-labelledby`}),` at it. A summary without a title throws NG0951.`]}),`
`,(0,f.jsx)(t.h2,{id:`testing`,children:`Testing`}),`
`,(0,f.jsxs)(t.p,{children:[(0,f.jsx)(t.code,{children:`SummaryHarness`}),` from `,(0,f.jsx)(t.code,{children:`@critsource/ui-web/testing`}),` reads a summary in a test: its title and points, the id that names it, the look of its box and title, and the place of its parts.`]})]})}function MDXContent(e={}){let{wrapper:t}={...n(),...e.components};return t?(0,f.jsx)(t,{...e,children:(0,f.jsx)(_createMdxContent,{...e})}):_createMdxContent(e)}var f;function init_summary(){return(init_summary=e((()=>{f=o(),t(),r(),c()})))()}init_summary();export{MDXContent as default};