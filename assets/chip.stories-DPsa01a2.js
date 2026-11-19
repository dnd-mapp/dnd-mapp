import{n as e,r as t}from"./rolldown-runtime-vtgMY1y5.js";import{n,t as r}from"./arg-types-T86RJuJ3.js";import{a as i,i as a,n as o,r as s,t as c}from"./chip.component-CSovCT75.js";var l=t({Dm:()=>p,Examples:()=>m,Neutral:()=>d,Status:()=>f,__namedExportsOrder:()=>h,default:()=>u}),u,d,f,p,m,h;function init_chip_stories(){return(init_chip_stories=e((()=>{o(),i(),r(),u={title:`Elements/Chip`,component:c,argTypes:{kind:n({values:s,typeName:`ChipKind`,defaultValue:a,description:`How the chip looks: neutral, for tool names and conditions, status, for features that are not built yet, or DM, for tools meant for dungeon masters.`}),label:{description:`The content the chip projects, which carries its meaning.`,control:`text`}},render:e=>({props:e,template:`<dma-chip [kind]="kind">{{ label }}</dma-chip>`})},d={args:{kind:`neutral`,label:`Label`}},f={args:{kind:`status`,label:`Planned`}},p={args:{kind:`dm`,label:`DM`}},m={render:()=>({template:`
            <div style="display: flex; flex-wrap: wrap; gap: var(--space-8)">
                <dma-chip kind="status">Planned</dma-chip>
                <dma-chip kind="status">Concept</dma-chip>
                <dma-chip kind="dm">DM</dma-chip>
                <dma-chip>Poisoned</dma-chip>
                <dma-chip>Prone</dma-chip>
                <dma-chip>Spreadsheets</dma-chip>
            </div>
        `})},h=[`Neutral`,`Status`,`Dm`,`Examples`],d.parameters={...d.parameters,docs:{...d.parameters?.docs,source:{originalSource:`{
  args: {
    kind: 'neutral',
    label: 'Label'
  }
}`,...d.parameters?.docs?.source}}},f.parameters={...f.parameters,docs:{...f.parameters?.docs,source:{originalSource:`{
  args: {
    kind: 'status',
    label: 'Planned'
  }
}`,...f.parameters?.docs?.source}}},p.parameters={...p.parameters,docs:{...p.parameters?.docs,source:{originalSource:`{
  args: {
    kind: 'dm',
    label: 'DM'
  }
}`,...p.parameters?.docs?.source}}},m.parameters={...m.parameters,docs:{...m.parameters?.docs,source:{originalSource:`{
  render: () => ({
    template: \`
            <div style="display: flex; flex-wrap: wrap; gap: var(--space-8)">
                <dma-chip kind="status">Planned</dma-chip>
                <dma-chip kind="status">Concept</dma-chip>
                <dma-chip kind="dm">DM</dma-chip>
                <dma-chip>Poisoned</dma-chip>
                <dma-chip>Prone</dma-chip>
                <dma-chip>Spreadsheets</dma-chip>
            </div>
        \`
  })
}`,...m.parameters?.docs?.source},description:{story:`Chips in a row, as Card holds them.`,...m.parameters?.docs?.description}}}})))()}export{l as a,f as i,m as n,init_chip_stories as o,d as r,p as t};