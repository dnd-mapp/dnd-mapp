import{n as e,r as t}from"./rolldown-runtime-vtgMY1y5.js";import{n,t as r}from"./disclosure.component-Ca4ris-u.js";var i=t({ClosedDefault:()=>o,ClosedFocus:()=>c,ClosedHover:()=>s,OpenDefault:()=>l,OpenFocus:()=>d,OpenHover:()=>u,Stacked:()=>f,__namedExportsOrder:()=>p,default:()=>a}),a,o,s,c,l,u,d,f,p;function init_disclosure_stories(){return(init_disclosure_stories=e((()=>{n(),a={title:`Patterns/Disclosure`,component:r,argTypes:{open:{description:"The `open` attribute of the `<details>`, which the browser sets as the reader opens the panel.",control:`boolean`,table:{type:{summary:`boolean`},defaultValue:{summary:`false`}}},summary:{description:"The element marked `dma-disclosure-summary`, which labels the summary.",control:`text`},content:{description:`The content the panel projects.`,control:`text`}},render:e=>({props:e,template:`
            <details dma-disclosure [open]="open">
                <span dma-disclosure-summary>{{ summary }}</span>
                <p>{{ content }}</p>
            </details>
        `})},o={args:{open:!1,summary:`Question or heading`,content:`The answer or content, in one or more short paragraphs. It shows only while the disclosure is open.`}},s={args:{open:!1,summary:`Question or heading`,content:`The answer or content, in one or more short paragraphs. It shows only while the disclosure is open.`},parameters:{pseudo:{hover:!0}}},c={args:{open:!1,summary:`Question or heading`,content:`The answer or content, in one or more short paragraphs. It shows only while the disclosure is open.`},parameters:{pseudo:{focusVisible:!0}}},l={args:{open:!0,summary:`Question or heading`,content:`The answer or content, in one or more short paragraphs. It shows only while the disclosure is open.`}},u={args:{open:!0,summary:`Question or heading`,content:`The answer or content, in one or more short paragraphs. It shows only while the disclosure is open.`},parameters:{pseudo:{hover:!0}}},d={args:{open:!0,summary:`Question or heading`,content:`The answer or content, in one or more short paragraphs. It shows only while the disclosure is open.`},parameters:{pseudo:{focusVisible:!0}}},f={render:()=>({template:`
            <details dma-disclosure>
                <span dma-disclosure-summary>What is a saving throw?</span>
                <p>A roll that decides whether a creature resists a spell, a trap, or a poison.</p>
            </details>
            <details dma-disclosure open>
                <span dma-disclosure-summary>How long is a round?</span>
                <p>About six seconds in the world of the game.</p>
                <p>Each creature in the fight takes one turn in it, in the order of initiative.</p>
            </details>
            <details dma-disclosure>
                <span dma-disclosure-summary>What does advantage do?</span>
                <p>You roll two d20s and use the higher roll.</p>
            </details>
        `})},p=[`ClosedDefault`,`ClosedHover`,`ClosedFocus`,`OpenDefault`,`OpenHover`,`OpenFocus`,`Stacked`],o.parameters={...o.parameters,docs:{...o.parameters?.docs,source:{originalSource:`{
  args: {
    open: false,
    summary: 'Question or heading',
    content: 'The answer or content, in one or more short paragraphs. It shows only while the disclosure is open.'
  }
}`,...o.parameters?.docs?.source}}},s.parameters={...s.parameters,docs:{...s.parameters?.docs,source:{originalSource:`{
  args: {
    open: false,
    summary: 'Question or heading',
    content: 'The answer or content, in one or more short paragraphs. It shows only while the disclosure is open.'
  },
  parameters: {
    pseudo: {
      hover: true
    }
  }
}`,...s.parameters?.docs?.source}}},c.parameters={...c.parameters,docs:{...c.parameters?.docs,source:{originalSource:`{
  args: {
    open: false,
    summary: 'Question or heading',
    content: 'The answer or content, in one or more short paragraphs. It shows only while the disclosure is open.'
  },
  parameters: {
    pseudo: {
      focusVisible: true
    }
  }
}`,...c.parameters?.docs?.source}}},l.parameters={...l.parameters,docs:{...l.parameters?.docs,source:{originalSource:`{
  args: {
    open: true,
    summary: 'Question or heading',
    content: 'The answer or content, in one or more short paragraphs. It shows only while the disclosure is open.'
  }
}`,...l.parameters?.docs?.source}}},u.parameters={...u.parameters,docs:{...u.parameters?.docs,source:{originalSource:`{
  args: {
    open: true,
    summary: 'Question or heading',
    content: 'The answer or content, in one or more short paragraphs. It shows only while the disclosure is open.'
  },
  parameters: {
    pseudo: {
      hover: true
    }
  }
}`,...u.parameters?.docs?.source}}},d.parameters={...d.parameters,docs:{...d.parameters?.docs,source:{originalSource:`{
  args: {
    open: true,
    summary: 'Question or heading',
    content: 'The answer or content, in one or more short paragraphs. It shows only while the disclosure is open.'
  },
  parameters: {
    pseudo: {
      focusVisible: true
    }
  }
}`,...d.parameters?.docs?.source}}},f.parameters={...f.parameters,docs:{...f.parameters?.docs,source:{originalSource:`{
  render: () => ({
    template: \`
            <details dma-disclosure>
                <span dma-disclosure-summary>What is a saving throw?</span>
                <p>A roll that decides whether a creature resists a spell, a trap, or a poison.</p>
            </details>
            <details dma-disclosure open>
                <span dma-disclosure-summary>How long is a round?</span>
                <p>About six seconds in the world of the game.</p>
                <p>Each creature in the fight takes one turn in it, in the order of initiative.</p>
            </details>
            <details dma-disclosure>
                <span dma-disclosure-summary>What does advantage do?</span>
                <p>You roll two d20s and use the higher roll.</p>
            </details>
        \`
  })
}`,...f.parameters?.docs?.source},description:{story:`Disclosures stacked as questions and answers, the place they are made for, with a divider under each.`,...f.parameters?.docs?.description}}}})))()}export{d as a,i as c,l as i,init_disclosure_stories as l,c as n,u as o,s as r,f as s,o as t};