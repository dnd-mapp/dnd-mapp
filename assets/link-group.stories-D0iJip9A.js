import{n as e,r as t}from"./rolldown-runtime-vtgMY1y5.js";import{a as n,t as r}from"./dist-B-70Eai5.js";import{t as i}from"./link.component-wSLcnZDx.js";import{t as a}from"./link-CW6s-jj9.js";import{n as o,t as s}from"./link-group.component-BGmstdGY.js";var c=t({Default:()=>u,__namedExportsOrder:()=>d,default:()=>l}),l,u,d;function init_link_group_stories(){return(init_link_group_stories=e((()=>{r(),o(),a(),l={title:`Patterns/Link group`,component:s,decorators:[n({imports:[i]})],argTypes:{heading:{description:`The heading the link group projects, at the level the page needs.`,control:`text`},links:{description:"The labels of the quiet links the link group projects, one `<li>` each.",control:`object`}},render:e=>({props:e,template:`
            <dma-link-group>
                <h2>{{ heading }}</h2>
                @for (link of links; track $index) {
                    <li><a dma-link kind="quiet" href="#">{{ link }}</a></li>
                }
            </dma-link-group>
        `})},u={args:{heading:`Group title`,links:[`Link 1`,`Link 2`,`Link 3`,`Link 4`]}},d=[`Default`],u.parameters={...u.parameters,docs:{...u.parameters?.docs,source:{originalSource:`{
  args: {
    heading: 'Group title',
    links: ['Link 1', 'Link 2', 'Link 3', 'Link 4']
  }
}`,...u.parameters?.docs?.source},description:{story:`The link group as Penpot draws it, with the same placeholder text.`,...u.parameters?.docs?.description}}}})))()}export{init_link_group_stories as n,c as r,u as t};