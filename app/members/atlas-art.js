// Original vector artwork, shared by the interactive atlas and exported postcards.
export function LandmarkDrawing({ kind, ...props }) {
  const columns = [21, 34, 47, 60, 73, 86];
  return <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 110 100" {...props}>
    <g stroke="#514735" strokeWidth="1.2" strokeLinejoin="round" strokeLinecap="round">
      <ellipse cx="55" cy="94" rx="49" ry="3" fill="#b7ad8c" opacity=".35" stroke="none" />
      {kind === "bridge" ? <>
        <path d="M1 79L109 79L109 85L1 85Z" fill="#d3b792" /><path d="M1 82H109" />
        {[24,74].map(x => <g key={x}><path d={`M${x} 80V24H${x+17}V80Z`} fill="#d1af86" /><path d={`M${x-2} 24V18H${x+19}V24ZM${x} 17L${x+8.5} 9L${x+17} 17Z`} fill="#dbc5a4" />{[32,43,54,65,75].map(y => <path key={y} d={`M${x} ${y}H${x+17}`} stroke="#aa8c68" strokeWidth=".6" />)}<path d={`M${x+4} 74V42L${x+8.5} 33L${x+13} 42V74Z`} fill="#f3eddd" /><path d={`M${x+8.5} 46V74`} /></g>)}
        <path d="M1 68Q31 25 55 66Q82 25 109 68" fill="none" stroke="#705641" strokeWidth="1.8" />
        {[4,10,16,46,51,57,63,68,97,103,108].map(x => <path key={x} d={`M${x} ${x<20||x>95?61:61}V79`} stroke="#8b7759" strokeWidth=".6" />)}
        <path d="M1 90q8-3 16 0t16 0M70 91q8-3 16 0t16 0" stroke="#8daaa0" fill="none" />
      </> : kind === "arch" ? <>
        <path d="M19 89V24H91V89H71V59C71 32 39 32 39 59V89Z" fill="#e3d6b9" /><path d="M16 24V17H94V24ZM20 17V11H90V17Z" fill="#f3e6c9" />
        <path d="M26 30V83M33 30V83M77 30V83M84 30V83" stroke="#b8a580" />
        {[35,46,57,68,79].map(y => <path key={y} d={`M20 ${y}H37M73 ${y}H90`} stroke="#c2b18f" strokeWidth=".5" />)}
        <path d="M35 61C35 27 75 27 75 61M13 91H97M24 28H87" fill="none" />
        <circle cx="55" cy="30" r="3" fill="#b78d64" /><path d="M46 20H64M45 34L48 28M62 28L65 34" stroke="#aa906f" />
      </> : kind === "tower" ? <>
        <path d="M28 88L29 15L60 4L88 22V88Z" fill="#d5bd98" /><path d="M60 4V88L88 88V22Z" fill="#c2a17d" />
        <path d="M27 15L60 2L90 20V25L60 8L28 21ZM25 88H91V93H25Z" fill="#e7d4b1" />
        {Array.from({length:10},(_,i)=>27+i*5.5).map(y => <g key={y} strokeWidth=".5"><path d={`M29 ${y}L60 ${y-8}L88 ${y+5}`} stroke="#9c805d" fill="none" />{[35,43,51].map(x=><path key={x} d={`M${x} ${y-(x-29)*.26+1}v3h4v-3Z`} fill="#766c54" />)}{[66,74,82].map(x=><path key={x} d={`M${x} ${y-8+(x-60)*.46+1}v3h3v-3Z`} fill="#827155" />)}</g>)}
      </> : <>
        {kind === "dome" ? <><path d="M23 40C23 10 87 10 87 40Z" fill="#a4b4a0" /><path d="M26 40C24 18 43 12 55 12C42 18 37 27 37 40ZM57 12C75 17 83 27 84 40" fill="#7f9589" stroke="none" /><path d="M40 16Q34 28 35 40M55 13V40M70 16Q77 28 76 40" fill="none" stroke="#5b766c" /><path d="M50 13V6H60V13ZM20 40H90V45H20Z" fill="#e7d8b8" /></> : kind === "clock" ? <><path d="M9 41L55 18L101 41Z" fill="#be8964" /><path d="M24 36L55 22L86 36Z" fill="#e5caa2" /><path d="M42 19L48 14L51 19M59 19L62 13L68 19" fill="#849580" /><circle cx="55" cy="31" r="8" fill="#f9eed4" /><path d="M55 26V31L59 33" strokeWidth="1.4" /></> : <><path d="M10 34H100V40H10ZM14 26H96V34H14Z" fill="#e9d8b7" /><path d="M26 26L55 13L84 26Z" fill="#c7a67b" /><path d="M24 29H86" stroke="#af916b" /></>}
        <path d="M12 47H98V82H12Z" fill="#ddc5a0" /><path d="M12 68H98M12 57H98M12 77H98" stroke="#c3ab86" strokeWidth=".5" />
        <path d="M8 42H102V48H8ZM9 83H101V87H9ZM5 88H105V92H5Z" fill="#f0e0bd" />
        {columns.map(x => <g key={x}><path d={`M${x-2} 50H${x+5}V53H${x-2}Z`} fill="#eee1c6" /><path d={`M${x} 53V81M${x+3} 53V81`} stroke="#ad9775" strokeWidth="2.3" /><path d={`M${x+1.5} 54V80`} stroke="#f1e3c5" strokeWidth=".7" /><path d={`M${x-2} 81H${x+5}`} strokeWidth="2" /></g>)}
        {kind === "library" && [9,92].map(x => <g key={x}><path d={`M${x-4} 81H${x+9}V87H${x-4}Z`} fill="#c7ae87" /><path d={`M${x} 78Q${x-5} 73 ${x-1} 68Q${x+1} 64 ${x+5} 68L${x+5} 76L${x+8} 80Z`} fill="#b79b73" /><path d={`M${x-1} 70L${x-4} 68M${x+5} 77L${x+9} 73`} /></g>)}
      </>}
    </g>
  </svg>;
}

export function AtlasBackdrop() {
  return <svg className="atlas-land" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 760" aria-hidden="true">
    <defs>
      <pattern id="atlas-water" width="44" height="38" patternUnits="userSpaceOnUse"><path d="M5 22q7-3 14 0t14 0" fill="none" stroke="#89aaa2" strokeWidth=".8" opacity=".45" /></pattern>
      <pattern id="atlas-paper" width="12" height="16" patternUnits="userSpaceOnUse"><path d="M1 3h1M7 12h1" stroke="#9c8860" opacity=".13" /></pattern>
      <pattern id="atlas-blocks" width="36" height="27" patternUnits="userSpaceOnUse" patternTransform="rotate(22)"><rect x="3" y="3" width="27" height="17" rx="2" fill="#d8c9a6" fillOpacity=".38" stroke="#c8b993" strokeWidth=".65" /></pattern>
      <clipPath id="atlas-island"><path d="M430-10L663-10C643 86 606 156 576 223C545 293 514 356 476 418C443 470 411 505 379 550C346 596 310 642 276 680Q258 696 242 674C225 651 235 620 247 591C264 550 280 514 299 472C320 427 346 372 363 323C382 268 395 214 400 153C405 105 417 40 430-10Z" /></clipPath>
    </defs>
    <rect width="800" height="760" fill="#c8dcd1" /><rect width="800" height="760" fill="url(#atlas-water)" />
    <path d="M0 0H294C307 63 345 89 333 126C312 184 269 229 247 284C224 344 190 374 171 431C147 506 119 550 89 614C69 662 25 687 0 701Z" fill="#e8dcc1" stroke="#a49879" strokeWidth="1.6" />
    <path d="M800 151C751 186 731 238 705 280C678 323 640 353 603 370C559 391 542 432 524 476C506 518 456 552 429 594C401 638 375 693 353 760H800Z" fill="#e7dabe" stroke="#a49879" strokeWidth="1.6" />
    <path d="M430-10L663-10C643 86 606 156 576 223C545 293 514 356 476 418C443 470 411 505 379 550C346 596 310 642 276 680Q258 696 242 674C225 651 235 620 247 591C264 550 280 514 299 472C320 427 346 372 363 323C382 268 395 214 400 153C405 105 417 40 430-10Z" fill="#f4e8cd" stroke="#93896b" strokeWidth="1.7" />
    <g clipPath="url(#atlas-island)"><rect width="800" height="760" fill="url(#atlas-blocks)" /><path d="M580-30C553 145 484 308 426 415L276 650M621-15C587 170 521 319 465 405L319 608M484-10C468 145 423 295 370 410L262 666" fill="none" stroke="#f9f0da" strokeWidth="7" /><path d="M582-30C552 145 484 308 426 415L276 650" fill="none" stroke="#c4ae83" strokeWidth="1.3" />
      <path d="M437 449C398 462 367 502 355 557M418 485L294 501M396 524L278 547M364 567L267 594" fill="none" stroke="#f8efda" strokeWidth="6" />
      <path d="M493 149L553 172L499 296L439 275Z" fill="#afbb91" stroke="#8f9c73" strokeWidth="1.2" />
      <path d="M506 172C488 188 526 215 486 234S484 258 465 268" fill="none" stroke="#e3e6c4" strokeWidth="3" /><ellipse cx="504" cy="199" rx="12" ry="19" transform="rotate(23 504 199)" fill="#abc7b5" />
      {[ [485,175],[473,205],[461,240],[515,237],[494,268] ].map(([x,y])=><g key={x}><circle cx={x} cy={y} r="4" fill="#889d71" /><circle cx={x+4} cy={y-4} r="4" fill="#a0ad7a" /></g>)}
      <path d="M279 643L299 649L274 681L248 672Z" fill="#acb58c" />
    </g>
    <rect width="800" height="760" fill="url(#atlas-paper)" />
    <path d="M326 631L534 612" stroke="#c3a97d" strokeWidth="8" /><path d="M326 631L534 612" stroke="#776b50" strokeWidth="1" strokeDasharray="3 5" />
    <g fontFamily="Georgia, serif" fill="#758f85"><text x="168" y="445" transform="rotate(-63 168 445)" fontSize="22" fontStyle="italic">Hudson River</text><text x="586" y="436" transform="rotate(-57 586 436)" fontSize="20" fontStyle="italic">East River</text></g>
    <g fontFamily="Arial, sans-serif" fontSize="10" letterSpacing="2" fill="#918365"><text x="470" y="268" transform="rotate(-66 470 268)">CENTRAL PARK</text><text x="620" y="542" transform="rotate(-17 620 542)">BROOKLYN HEIGHTS</text><text x="587" y="665" fontSize="20" fontFamily="Georgia, serif" letterSpacing="4">BROOKLYN</text></g>
    <g transform="translate(72 64)" fill="#5b634f"><path d="M0 20L7 0L14 20L7 16Z" fill="#a76d50" /><path d="M7 23V40M-2 30H16" stroke="#69705b" /><text x="2" y="-10" fontFamily="Georgia" fontSize="16">N</text></g>
    <g transform="translate(52 142)" fill="#7d6c50"><text fontFamily="Georgia, serif" fontSize="38" fontStyle="italic"><tspan x="0">New</tspan><tspan x="0" dy="39">York</tspan></text><path d="M0 88H72" stroke="#a99a7b" /><text x="0" y="106" fontFamily="Arial" fontSize="9" letterSpacing="2">A POCKET ATLAS</text><text x="0" y="122" fontFamily="Arial" fontSize="9" letterSpacing="2">FOR THE CURIOUS</text></g>
    {[ [680,445],[711,427],[731,486],[607,708],[642,697],[40,495],[65,471] ].map(([x,y])=><g key={`${x}-${y}`} stroke="#839267" strokeWidth=".7"><path d={`M${x} ${y+8}v10`} /><circle cx={x} cy={y} r="8" fill="#a4b089" /><circle cx={x+5} cy={y-3} r="6" fill="#b3bc96" /></g>)}
    <g className="atlas-ferry" transform="translate(169 573)" stroke="#7b684d" strokeWidth="1"><path d="M0 0H34L27 10H7Z" fill="#b27957" /><path d="M8 0V-9H25V0Z" fill="#f7ecd4" /><path d="M15-9V-17" /><path d="M4 14q8-3 16 0t16 0" fill="none" stroke="#8ea89e" /></g>
    <g transform="translate(53 673)" fill="#7c6d50"><path d="M0 0H96M0-3V4M48-3V4M96-3V4" stroke="#8d8063" /><text y="23" fontFamily="Georgia" fontStyle="italic" fontSize="12">Wander a little.</text><text y="39" fontFamily="Georgia" fontStyle="italic" fontSize="12">Notice a lot.</text></g>
    <rect x="12" y="12" width="776" height="736" rx="2" fill="none" stroke="#9f9172" strokeWidth=".8" />
  </svg>;
}
