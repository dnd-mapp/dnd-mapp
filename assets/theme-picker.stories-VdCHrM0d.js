import{n as e,r as t}from"./rolldown-runtime-vtgMY1y5.js";import{A as n,B as r,C as i,D as a,I as o,L as s,O as c,R as l,U as u,W as d,b as f,h as p,l as m,nt as h,tt as g,u as _,v,x as y,y as b}from"./angular-platform-_ezXbbxl.js";import{n as ee,t as te}from"./dist-DHjgR8Xf.js";import{a as ne,s as re,t as ie}from"./icon-sun.component-Dt7irR-0.js";import{t as x}from"./icon-B0qhaTyE.js";import{n as S,t as C}from"./arg-types-T86RJuJ3.js";var w;function init_vite_plugin_angular_raw_L2hvbWUvcnVubmVyL3dvcmsvZG5kLW1hcHAvZG5kLW1hcHAvcGFja2FnZXMvdWkvd2ViL3NyYy9jb21wb25lbnRzL3RoZW1lLXBpY2tlci90aGVtZS1waWNrZXIuY29tcG9uZW50Lmh0bWw(){return(init_vite_plugin_angular_raw_L2hvbWUvcnVubmVyL3dvcmsvZG5kLW1hcHAvZG5kLW1hcHAvcGFja2FnZXMvdWkvd2ViL3NyYy9jb21wb25lbnRzL3RoZW1lLXBpY2tlci90aGVtZS1waWNrZXIuY29tcG9uZW50Lmh0bWw=e((()=>{w=`<legend class="cdk-visually-hidden">Theme</legend>
@for (option of options; track option) {
    <dma-theme-option
        [theme]="option"
        [name]="name"
        [checked]="theme() === option"
        [display]="display()"
        (picked)="select($event)"
    />
}
`})))()}var T;function init_theme_picker_component(){return(init_theme_picker_component=e((()=>{T=`.cdk-visually-hidden{clip:rect(0 0 0 0);white-space:nowrap;-webkit-appearance:none;-moz-appearance:none;border:0;outline:0;width:1px;height:1px;margin:-1px;padding:0;position:absolute;left:0;overflow:hidden}[dir=rtl] .cdk-visually-hidden{left:auto;right:0}:host{align-items:center;gap:var(--space-4);min-inline-size:0;padding:calc(var(--space-4) - var(--border-width-default));border:var(--border-width-default) solid var(--color-border-control);border-radius:var(--radius-md);background:var(--color-background-sunken);margin:0;display:inline-flex;position:relative}`})))()}var E;function init_vite_plugin_angular_raw_L2hvbWUvcnVubmVyL3dvcmsvZG5kLW1hcHAvZG5kLW1hcHAvcGFja2FnZXMvdWkvd2ViL3NyYy9jb21wb25lbnRzL3RoZW1lLXBpY2tlci90aGVtZS1vcHRpb24uY29tcG9uZW50Lmh0bWw(){return(init_vite_plugin_angular_raw_L2hvbWUvcnVubmVyL3dvcmsvZG5kLW1hcHAvZG5kLW1hcHAvcGFja2FnZXMvdWkvd2ViL3NyYy9jb21wb25lbnRzL3RoZW1lLXBpY2tlci90aGVtZS1vcHRpb24uY29tcG9uZW50Lmh0bWw=e((()=>{E=`<label class="option">
    <input
        class="input cdk-visually-hidden"
        type="radio"
        [name]="name()"
        [value]="theme()"
        [checked]="checked()"
        (change)="picked.emit(theme())"
    />
    <span class="box">
        @switch (theme()) {
            @case ('system') {
                <dma-icon-monitor />
            }
            @case ('light') {
                <dma-icon-sun />
            }
            @case ('dark') {
                <dma-icon-moon />
            }
        }
        <span class="label" [class.cdk-visually-hidden]="display() === 'icons'">{{ label() }}</span>
    </span>
</label>
`})))()}var D;function init_theme_option_component(){return(init_theme_option_component=e((()=>{D=`.cdk-visually-hidden{clip:rect(0 0 0 0);white-space:nowrap;-webkit-appearance:none;-moz-appearance:none;border:0;outline:0;width:1px;height:1px;margin:-1px;padding:0;position:absolute;left:0;overflow:hidden}[dir=rtl] .cdk-visually-hidden{left:auto;right:0}:host{--option-size:calc(var(--size-target-min) - 2 * var(--space-4));display:block}.option{cursor:pointer;display:block;position:relative}.box{box-sizing:border-box;justify-content:center;align-items:center;gap:var(--space-8);height:var(--option-size);padding-inline:calc(var(--space-12) - var(--border-width-default));border:var(--border-width-default) solid transparent;border-radius:var(--radius-sm);color:var(--color-foreground-muted);font-family:var(--typography-nav-font-family);font-size:var(--typography-nav-font-size);font-weight:var(--typography-nav-font-weight);letter-spacing:var(--typography-nav-letter-spacing);line-height:var(--typography-nav-line-height);-webkit-text-decoration:var(--typography-nav-text-decoration);text-decoration:var(--typography-nav-text-decoration);text-transform:var(--typography-nav-text-case);display:flex}:host(.icons) .box{width:var(--option-size);padding-inline:0}dma-icon-monitor,dma-icon-sun,dma-icon-moon{width:var(--size-icon-sm);height:var(--size-icon-sm)}.option:hover .box{background:var(--color-background-hover);color:var(--color-foreground-default)}.input:focus-visible+.box{outline:var(--border-width-focus) solid var(--color-focus-ring);outline-offset:var(--focus-offset)}.input:checked+.box{border-color:var(--color-border-strong);background:var(--color-background-raised);color:var(--color-foreground-default)}@media (forced-colors:active){.box{border-color:canvas}.input:checked+.box{border-color:highlight}}`})))()}function themePickerDisplayAttr(e){return Object.values(O).includes(e)?e:k}var O,k;function init_theme_picker_types(){return(init_theme_picker_types=e((()=>{O={Labels:`labels`,Icons:`icons`},k=O.Labels})))()}function tryCatchSync(e){try{return{ok:!0,value:e()}}catch(e){return{ok:!1,error:e}}}function init_try_catch(){return(init_try_catch=e((()=>{})))()}var A;function init_storage_token(){return(init_storage_token=e((()=>{m(),v(),init_try_catch(),A=new l(`BROWSER_STORAGE`,{providedIn:`root`,factory:()=>{if(!_(u(r)))return null;let e=u(o).defaultView,t=tryCatchSync(()=>e?.localStorage??null);return t.ok?t.value:null}})})))()}var j;function init_storage_service(){return(init_storage_service=e((()=>{h(),m(),v(),init_try_catch(),init_storage_token(),j=class StorageService{storage=u(A);view=u(o).defaultView;watchers=new Set;onStorage=e=>{if(e.storageArea===this.storage)for(let{key:t,listener:n}of this.watchers)(e.key===null||e.key===t)&&n(e.key===null?null:e.newValue)};constructor(){this.storage&&(this.view?.addEventListener(`storage`,this.onStorage),u(s).onDestroy(()=>this.view?.removeEventListener(`storage`,this.onStorage)))}get(e){let t=this.storage,n=tryCatchSync(()=>t?.getItem(e)??null);return n.ok?n.value:null}set(e,t){return this.write(n=>{n.setItem(e,t)})}remove(e){return this.write(t=>{t.removeItem(e)})}watch(e,t){let n={key:e,listener:t};return this.watchers.add(n),()=>{this.watchers.delete(n)}}write(e){let t=this.storage;return t!==null&&tryCatchSync(()=>{e(t)}).ok}static ctorParameters=()=>[]},j=g([a({providedIn:`root`})],j)})))()}var M;function init_storage_types(){return(init_storage_types=e((()=>{M={Theme:`dma-theme`}})))()}function init_storage(){return(init_storage=e((()=>{init_storage_service(),init_storage_token(),init_storage_types()})))()}function parseTheme(e){return Object.values(N).includes(e)?e:P}var N,P,F;function init_theme_types(){return(init_theme_types=e((()=>{N={System:`system`,Dark:`dark`,Light:`light`},P=N.System,F=`data-theme`})))()}var I;function init_theme_service(){return(init_theme_service=e((()=>{h(),m(),v(),init_storage(),init_theme_types(),I=class ThemeService{document=u(o);storage=u(j);isBrowser=_(u(r));_theme=d(P);theme=this._theme.asReadonly();onChange=e=>{this.apply(parseTheme(e))};constructor(){this.isBrowser&&(this._theme.set(parseTheme(this.storage.get(M.Theme))),this.storage.watch(M.Theme,this.onChange))}setTheme(e){if(!this.isBrowser)return;let t=parseTheme(e);t===N.System?this.storage.remove(M.Theme):this.storage.set(M.Theme,t),this.apply(t)}apply(e){let t=this.document.documentElement;e===N.System?t.removeAttribute(F):t.setAttribute(F,e),this._theme.set(e)}static ctorParameters=()=>[]},I=g([a({providedIn:`root`})],I)})))()}function init_theme(){return(init_theme=e((()=>{init_theme_service(),init_theme_types()})))()}var L,R;function init_theme_option_component$1(){return(init_theme_option_component$1=e((()=>{h(),init_vite_plugin_angular_raw_L2hvbWUvcnVubmVyL3dvcmsvZG5kLW1hcHAvZG5kLW1hcHAvcGFja2FnZXMvdWkvd2ViL3NyYy9jb21wb25lbnRzL3RoZW1lLXBpY2tlci90aGVtZS1vcHRpb24uY29tcG9uZW50Lmh0bWw(),init_theme_option_component(),v(),init_theme_picker_types(),init_theme(),x(),L={[N.System]:`System`,[N.Light]:`Light`,[N.Dark]:`Dark`},R=class ThemeOptionComponent{theme=b.required();name=b.required();checked=b(!1,{transform:p});display=b(k,{transform:themePickerDisplayAttr});picked=f();label=y(()=>L[this.theme()]);static propDecorators={theme:[{type:c,args:[{isSignal:!0,alias:`theme`,required:!0,transform:void 0}]}],name:[{type:c,args:[{isSignal:!0,alias:`name`,required:!0,transform:void 0}]}],checked:[{type:c,args:[{isSignal:!0,alias:`checked`,required:!1,transform:void 0}]}],display:[{type:c,args:[{isSignal:!0,alias:`display`,required:!1,transform:void 0}]}],picked:[{type:n,args:[`picked`]}]}},R=g([i({selector:`dma-theme-option`,template:E,imports:[re,ne,ie],host:{"[class.icons]":`display() === 'icons'`},styles:[D]})],R)})))()}var z,B,V;function init_theme_picker_component$1(){return(init_theme_picker_component$1=e((()=>{h(),init_vite_plugin_angular_raw_L2hvbWUvcnVubmVyL3dvcmsvZG5kLW1hcHAvZG5kLW1hcHAvcGFja2FnZXMvdWkvd2ViL3NyYy9jb21wb25lbnRzL3RoZW1lLXBpY2tlci90aGVtZS1waWNrZXIuY29tcG9uZW50Lmh0bWw(),init_theme_picker_component(),v(),init_theme_option_component$1(),init_theme_picker_types(),init_theme(),z=[N.System,N.Light,N.Dark],B=0,V=class ThemePickerComponent{themeService=u(I);display=b(k,{transform:themePickerDisplayAttr});options=z;theme=this.themeService.theme;name=`dma-theme-picker-${(B++).toString()}`;select(e){this.themeService.setTheme(e)}static propDecorators={display:[{type:c,args:[{isSignal:!0,alias:`display`,required:!1,transform:void 0}]}]}},V=g([i({selector:`fieldset[dma-theme-picker]`,template:w,imports:[R],styles:[T]})],V)})))()}var H=t({DarkSelected:()=>Q,IconsDefault:()=>Y,IconsFocus:()=>Z,IconsHover:()=>X,LabelsDefault:()=>K,LabelsFocus:()=>J,LabelsHover:()=>q,__namedExportsOrder:()=>$,default:()=>U});function withSelected(e){return ee({providers:[{provide:I,useFactory:()=>new StoryThemeService(e)}]})}var StoryThemeService,U,W,G,K,q,J,Y,X,Z,Q,$;function init_theme_picker_stories(){return(init_theme_picker_stories=e((()=>{v(),te(),init_theme_picker_component$1(),init_theme_picker_types(),C(),init_theme(),StoryThemeService=class{_theme=d(N.System);theme=this._theme.asReadonly();constructor(e){this._theme.set(e)}setTheme(e){this._theme.set(e)}},U={title:`Theme picker`,component:V,argTypes:{display:S({values:O,typeName:`ThemePickerDisplay`,defaultValue:k,description:`How the options show: each icon with its label, or the icons alone where space is tight.`})},decorators:[withSelected(N.System)],render:e=>({props:e,template:`<fieldset dma-theme-picker [display]="display"></fieldset>`})},W={pseudo:{hover:`label:has(input[value="light"])`}},G={pseudo:{focusVisible:`input[value="system"]`}},K={args:{display:`labels`}},q={args:{display:`labels`},parameters:W},J={args:{display:`labels`},parameters:G},Y={args:{display:`icons`}},X={args:{display:`icons`},parameters:W},Z={args:{display:`icons`},parameters:G},Q={args:{display:`labels`},decorators:[withSelected(N.Dark)]},$=[`LabelsDefault`,`LabelsHover`,`LabelsFocus`,`IconsDefault`,`IconsHover`,`IconsFocus`,`DarkSelected`],K.parameters={...K.parameters,docs:{...K.parameters?.docs,source:{originalSource:`{
  args: {
    display: 'labels'
  }
}`,...K.parameters?.docs?.source}}},q.parameters={...q.parameters,docs:{...q.parameters?.docs,source:{originalSource:`{
  args: {
    display: 'labels'
  },
  parameters: hover
}`,...q.parameters?.docs?.source}}},J.parameters={...J.parameters,docs:{...J.parameters?.docs,source:{originalSource:`{
  args: {
    display: 'labels'
  },
  parameters: focus
}`,...J.parameters?.docs?.source}}},Y.parameters={...Y.parameters,docs:{...Y.parameters?.docs,source:{originalSource:`{
  args: {
    display: 'icons'
  }
}`,...Y.parameters?.docs?.source}}},X.parameters={...X.parameters,docs:{...X.parameters?.docs,source:{originalSource:`{
  args: {
    display: 'icons'
  },
  parameters: hover
}`,...X.parameters?.docs?.source}}},Z.parameters={...Z.parameters,docs:{...Z.parameters?.docs,source:{originalSource:`{
  args: {
    display: 'icons'
  },
  parameters: focus
}`,...Z.parameters?.docs?.source}}},Q.parameters={...Q.parameters,docs:{...Q.parameters?.docs,source:{originalSource:`{
  args: {
    display: 'labels'
  },
  decorators: [withSelected(Theme.Dark)]
}`,...Q.parameters?.docs?.source},description:{story:`Dark selected, as the picker shows it to a reader who picked Dark.`,...Q.parameters?.docs?.description}}}})))()}export{K as a,init_theme_picker_stories as c,X as i,H as l,Y as n,J as o,Z as r,q as s,Q as t};