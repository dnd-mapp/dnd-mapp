import{n as e}from"./rolldown-runtime-vtgMY1y5.js";import{N as t,P as n,c as r,n as i,s as a,x as o}from"./blocks-CDxrhzRn.js";import{i as s,n as c,r as l,t as u}from"./data-table.stories-Dqe3nqYc.js";function _createMdxContent(e){let t={code:`code`,h1:`h1`,h2:`h2`,h3:`h3`,p:`p`,pre:`pre`,...n(),...e.components};return(0,d.jsxs)(d.Fragment,{children:[(0,d.jsx)(a,{of:l}),`
`,(0,d.jsx)(t.h1,{id:`data-table`,children:`Data table`}),`
`,(0,d.jsx)(t.p,{children:`Rows of data under a header row, which compare a few attributes across rows, such as the data that the Privacy page lists. It is the Data table component of the design system in Penpot.`}),`
`,(0,d.jsx)(i,{of:u}),`
`,(0,d.jsx)(t.h2,{id:`placing-a-data-table`,children:`Placing a data table`}),`
`,(0,d.jsxs)(t.p,{children:[`Data table is an attribute on `,(0,d.jsx)(t.code,{children:`<table>`}),`. Give it a `,(0,d.jsx)(t.code,{children:`<caption>`}),`, a `,(0,d.jsx)(t.code,{children:`<thead>`}),` with one row of `,(0,d.jsx)(t.code,{children:`<th scope="col">`}),`, and a `,(0,d.jsx)(t.code,{children:`<tbody>`}),` whose rows start with a `,(0,d.jsx)(t.code,{children:`<th scope="row">`}),`:`]}),`
`,(0,d.jsx)(t.pre,{children:(0,d.jsx)(t.code,{className:`language-html`,children:`<table dma-data-table>
    <caption>Data we process</caption>
    <thead>
        <tr>
            <th scope="col">Data</th>
            <th scope="col">Kept for</th>
        </tr>
    </thead>
    <tbody>
        <tr>
            <th scope="row">Server logs</th>
            <td>14 days</td>
        </tr>
    </tbody>
</table>
`})}),`
`,(0,d.jsxs)(t.p,{children:[`Write the `,(0,d.jsx)(t.code,{children:`<thead>`}),` and `,(0,d.jsx)(t.code,{children:`<tbody>`}),` yourself, since Angular adds neither. The table is as wide as its container, up to the measure of 720 px (`,(0,d.jsx)(t.code,{children:`--size-measure`}),`), so in a wider container, such as the canvas above, it stops at 720 px. It leaves its own place in the container to the section that holds it.`]}),`
`,(0,d.jsxs)(t.p,{children:[`The browser sizes each column from its content, so the longest column takes the most room, as in Penpot. To fix the width of a column, set it on a `,(0,d.jsx)(t.code,{children:`<col>`}),` in a `,(0,d.jsx)(t.code,{children:`<colgroup>`}),` after the caption.`]}),`
`,(0,d.jsx)(t.h2,{id:`viewport`,children:`Viewport`}),`
`,(0,d.jsxs)(t.p,{children:[`The layout follows the desktop breakpoint of `,(0,d.jsx)(t.code,{children:`@critsource/design-tokens`}),`, so the data table takes no input for it.`]}),`
`,(0,d.jsx)(t.h3,{id:`desktop`,children:`Desktop`}),`
`,(0,d.jsx)(t.p,{children:`From the breakpoint up, the rows sit under the header row, as the data table at the top of this page shows. The header row sits on the sunken background, and a divider splits each row from the one above it. The first cell of each row names it in strong body text; the other cells hold its data in small, muted body text.`}),`
`,(0,d.jsx)(t.h3,{id:`mobile`,children:`Mobile`}),`
`,(0,d.jsx)(t.p,{children:`Below the breakpoint, each row is a card, since the columns would leave each cell too little room. The first cell titles the card, and each other cell draws the label of its column above its data. The component copies each label from the text of the column header, again whenever the rows or the header row change, so a page sets no labels of its own.`}),`
`,(0,d.jsx)(i,{of:c,story:{inline:!1,height:`40rem`}}),`
`,(0,d.jsx)(t.h2,{id:`focus`,children:`Focus`}),`
`,(0,d.jsx)(t.p,{children:`A data table takes no focus, and Penpot draws no hover or focus state for it, since it is not interactive. A Link in a cell draws its own focus ring.`}),`
`,(0,d.jsx)(t.h2,{id:`accessibility`,children:`Accessibility`}),`
`,(0,d.jsxs)(t.p,{children:[`The caption names the table for assistive technology and stays out of sight, since the heading of the section names it on the page. The `,(0,d.jsx)(t.code,{children:`scope`}),` of each `,(0,d.jsx)(t.code,{children:`<th>`}),` tells assistive technology which cells it heads, so a screen reader reads each cell with its column and its row.`]}),`
`,(0,d.jsx)(t.p,{children:`Below the breakpoint, the header row leaves the screen but stays in the accessibility tree, so a screen reader still announces a table and reads each cell with its column. The card layout drops the table semantics of the elements in some browsers, so the component sets their roles itself. The label on each cell takes no text alternative, since a screen reader already reads the column header with the cell.`}),`
`,(0,d.jsx)(t.h2,{id:`testing`,children:`Testing`}),`
`,(0,d.jsxs)(t.p,{children:[(0,d.jsx)(t.code,{children:`DataTableHarness`}),` from `,(0,d.jsx)(t.code,{children:`@critsource/ui-web/testing`}),` reads a data table in a test: its caption and its size, the text, look, padding, box, and column label of each cell, the box, card border, and divider of each row, its border, and its width.`]})]})}function MDXContent(e={}){let{wrapper:t}={...n(),...e.components};return t?(0,d.jsx)(t,{...e,children:(0,d.jsx)(_createMdxContent,{...e})}):_createMdxContent(e)}var d;function init_data_table(){return(init_data_table=e((()=>{d=o(),t(),r(),s()})))()}init_data_table();export{MDXContent as default};