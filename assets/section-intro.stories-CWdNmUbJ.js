import{n as e,r as t}from"./rolldown-runtime-vtgMY1y5.js";import{n,t as r}from"./arg-types-T86RJuJ3.js";import{a as i,i as a,n as o,r as s,t as c}from"./section-intro.component-rFe8RNaz.js";var l=t({Center:()=>f,Start:()=>d,__namedExportsOrder:()=>p,default:()=>u}),u,d,f,p;function init_section_intro_stories(){return(init_section_intro_stories=e((()=>{o(),i(),r(),u={title:`Patterns/Section intro`,component:c,argTypes:{align:n({values:a,typeName:`SectionIntroAlign`,defaultValue:s,description:`How the section intro aligns its text: to the start of the line, or to its center.`}),eyebrow:{description:"The `<p>` the section intro projects before the heading.",control:`text`},heading:{description:`The heading the section intro projects, at the level the page needs.`,control:`text`},intro:{description:"The `<p>` the section intro projects after the heading.",control:`text`}},args:{eyebrow:`Eyebrow`,heading:`Section heading`,intro:`One or two sentences that say what this section covers and why it matters to the reader.`},render:e=>({props:e,template:`
            <hgroup dma-section-intro [align]="align">
                <p>{{ eyebrow }}</p>
                <h2>{{ heading }}</h2>
                <p>{{ intro }}</p>
            </hgroup>
        `})},d={args:{align:`start`}},f={args:{align:`center`}},p=[`Start`,`Center`],d.parameters={...d.parameters,docs:{...d.parameters?.docs,source:{originalSource:`{
  args: {
    align: 'start'
  }
}`,...d.parameters?.docs?.source}}},f.parameters={...f.parameters,docs:{...f.parameters?.docs,source:{originalSource:`{
  args: {
    align: 'center'
  }
}`,...f.parameters?.docs?.source}}}})))()}export{l as i,d as n,init_section_intro_stories as r,f as t};