// Original vector artwork, shared by the interactive atlas and exported postcards.
export function LandmarkDrawing({ kind, ...props }) {
  const columns = [21, 34, 47, 60, 73, 86];
  return <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 110 100" {...props}>
    <g stroke="#514735" strokeWidth="1.2" strokeLinejoin="round" strokeLinecap="round">
      <ellipse cx="55" cy="94" rx="49" ry="3" fill="#b7ad8c" opacity=".35" stroke="none" />
      {kind === "globe" ? <><ellipse cx="55" cy="84" rx="36" ry="5" fill="#a9c0b0" /><circle cx="55" cy="44" r="29" fill="#d6ddc0" /><ellipse cx="55" cy="44" rx="13" ry="29" fill="none" /><ellipse cx="55" cy="44" rx="29" ry="10" fill="none" /><path d="M26 44H84M55 15V73M40 20L36 32L48 41L44 54L52 60L55 45L68 35L72 22M66 51L75 59L67 66" fill="none" /><ellipse cx="55" cy="44" rx="40" ry="18" transform="rotate(-28 55 44)" fill="none" stroke="#8a8e7b" /><path d="M50 74L44 83H66L60 74" fill="#b9a984" /></> : kind === "garden" ? <><path d="M21 82V52H89V82Z" fill="#c2d2bb" /><path d="M37 52Q37 27 55 27Q73 27 73 52Z" fill="#b9cfc0" /><path d="M14 52L29 37L40 52M71 52L84 37L98 52" fill="#ccdbcb" /><path d="M22 61H89M22 70H89M28 52V82M38 52V82M48 52V82M60 52V82M72 52V82M83 52V82M45 30V52M55 27V52M65 30V52" fill="none" stroke="#799784" strokeWidth=".7" /><path d="M13 85H99" strokeWidth="3" />{[12,99].map(x=><g key={x}><path d={`M${x} 71V87`} /><circle cx={x} cy="62" r="10" fill="#9eb180" /><circle cx={x+3} cy="57" r="7" fill="#b6c49a" /></g>)}</> : kind === "ferry" ? <><path d="M9 67H103L91 84H23Z" fill="#c78451" /><path d="M22 67V44H87V67Z" fill="#dfbc82" /><path d="M29 44V31H75V44ZM48 31V20H58V31" fill="#f1e3bb" />{[29,42,55,68,81].map(x=><rect key={x} x={x} y="51" width="7" height="8" fill="#839d99" />)}<path d="M25 74H96M7 89Q20 84 33 89T59 89T85 89T108 89" fill="none" /><path d="M57 23H70L66 30H57Z" fill="#b57255" /></> : kind === "stadium" ? <><path d="M12 44Q55 14 98 44V72Q55 101 12 72Z" fill="#d6c7a7" /><ellipse cx="55" cy="44" rx="43" ry="21" fill="#ebe0c4" /><ellipse cx="55" cy="44" rx="27" ry="13" fill="#92ad89" /><path d="M48 39L62 39L65 46L55 51L45 46Z" fill="#d8b18b" />{[21,33,45,57,69,81,93].map(x=><path key={x} d={`M${x} 64V76`} strokeWidth="2" />)}<path d="M24 32V15M87 32V15M19 15H29M82 15H92" fill="none" /><path d="M42 23H68V30H42Z" fill="#647774" /></> : kind === "cinema" ? <><path d="M14 34H96V85H14Z" fill="#c8cbbc" /><path d="M9 34L20 18H87L101 34Z" fill="#a7bbb6" /><rect x="25" y="44" width="60" height="29" fill="#ede3c9" /><circle cx="55" cy="58" r="11" fill="#8c9b91" />{[ [51,53],[60,54],[55,63] ].map(([x,y])=><circle key={x} cx={x} cy={y} r="3" fill="#ede3c9" />)}<path d="M55 59L82 70M9 87H101" fill="none" /></> : kind === "empire" ? <><path d="M17 89V58H31V34H42V17H48V8H62V17H68V34H79V58H93V89Z" fill="#cfbea0" /><path d="M55 8V1M30 59H80M42 35H68M47 19H63" fill="none" /><path d="M59 19V86M67 36V86M78 60V86" stroke="#a38c6c" />{[23,34,45,56,67,78,88].map(y=><path key={y} d={`M50 ${y}H57`} strokeWidth="3" stroke="#7d7c6b" />)}<path d="M13 92H97" strokeWidth="3" /></> : kind === "bridge" ? <>
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

const BOROUGH_SHAPES = [
  ["Manhattan", "#efd6a3", "M460 62C439 105 421 152 406 197C389 245 367 282 343 331C321 374 308 421 282 469C266 498 249 531 261 553Q280 575 302 550C342 505 360 468 385 430C416 384 447 336 467 291C489 243 518 192 531 137L549 65Z"],
  ["Bronx", "#b4c9ac", "M567 39L843 42L885 117L847 181L800 220L748 239L679 213L620 225L550 183L558 126L541 96Z"],
  ["Queens", "#e3dfab", "M621 261L690 235L760 251L826 231L920 249L940 305L913 359L936 419L911 492L856 528L813 552L768 499L696 490L638 453L574 448L558 386L577 332Z"],
  ["Brooklyn", "#e4b5a3", "M477 466L552 445L618 457L675 496L750 508L800 565L773 614L811 673L782 723L707 746L664 712L607 752L552 724L500 733L455 696L413 662L398 608L431 560L447 513Z"],
  ["Staten Island", "#c9bdd4", "M234 589L296 590L329 631L312 684L272 721L225 752L167 773L124 748L97 709L116 666L151 636L174 607Z"],
];
export function AtlasBackdrop({ activeBorough = "All" }) {
  return <svg className="atlas-land" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 960 820" aria-hidden="true">
    <defs><pattern id="atlas-water" width="39" height="31" patternUnits="userSpaceOnUse"><path d="M3 17q7-3 14 0t14 0" stroke="#91b4a9" opacity=".5" fill="none" strokeWidth=".7" /></pattern><pattern id="atlas-paper" width="13" height="19" patternUnits="userSpaceOnUse"><path d="M2 4h1M9 12h1" stroke="#8f7651" opacity=".15" /></pattern><pattern id="atlas-blocks" width="28" height="23" patternUnits="userSpaceOnUse" patternTransform="rotate(22)"><rect x="3" y="3" width="18" height="12" rx="1" fill="#b09c7118" stroke="#9f8e6828" strokeWidth=".5" /></pattern>{BOROUGH_SHAPES.map(([name,,path])=><clipPath id={`atlas-${name.replaceAll(" ", "-")}`} key={name}><path d={path} /></clipPath>)}</defs>
    <rect width="960" height="820" fill="#c7dcd3" /><rect width="960" height="820" fill="url(#atlas-water)" />
    <path d="M0 0H354C354 121 317 154 293 220L248 327C225 375 187 426 170 475L103 549L0 574Z" fill="#e7dfce" stroke="#b1a58a" strokeWidth="1" />
    {BOROUGH_SHAPES.map(([name,color,path])=><g key={name} opacity={activeBorough === "All" || activeBorough === name ? 1 : .45}><path d={path} fill={color} stroke="#998468" strokeWidth="1.6" /><g clipPath={`url(#atlas-${name.replaceAll(" ", "-")})`}><rect width="960" height="820" fill="url(#atlas-blocks)" />{name === "Manhattan" ? <><path d="M478 60C452 202 392 341 277 548M519 62C474 253 415 346 308 520" stroke="#faf0d6" strokeWidth="6" fill="none" /><path d="M461 201L489 213L457 276L429 263Z" fill="#8fa679" stroke="#81936a" /><path d="M470 218L449 260" stroke="#c1cda5" strokeWidth="3" /></> : <><path d="M420 50L930 760M401 190L909 602M87 590L490 770M529 270L922 445" stroke="#f5edd666" strokeWidth="5" fill="none" /></>}</g></g>)}
    <rect width="960" height="820" fill="url(#atlas-paper)" />
    <path d="M323 531L472 544M489 290L589 325M422 448L526 472" stroke="#8f7658" strokeWidth="2" strokeDasharray="4 4" fill="none" />
    <path d="M283 634Q374 650 293 563" fill="none" stroke="#8b9c8b" strokeWidth="1.5" strokeDasharray="5 6" />
    <g fill="#728d82" fontFamily="Georgia" fontStyle="italic" fontSize="20"><text x="254" y="341" transform="rotate(-65 254 341)">Hudson River</text><text x="557" y="416" transform="rotate(-60 557 416)">East River</text><text x="65" y="570" fontSize="18">New York Harbor</text><text x="831" y="759" fontSize="16">Atlantic Ocean</text></g>
    <g fill="#6f624b" fontFamily="Georgia" fontSize="14" letterSpacing="3"><text x="472" y="205" transform="rotate(-66 472 205)">MANHATTAN</text><text x="686" y="76">THE BRONX</text><text x="759" y="312">QUEENS</text><text x="652" y="681">BROOKLYN</text><text x="136" y="723" fontSize="12">STATEN ISLAND</text></g>
    <g transform="translate(60 69)" fill="#74654d"><path d="M0 18L7 0L14 18L7 14Z" fill="#b07955" /><path d="M7 21V36M0 28H14" stroke="#74654d" /><text x="2" y="-8" fontFamily="Georgia" fontSize="14">N</text></g>
    <g transform="translate(57 153)" fill="#716047"><text fontFamily="Georgia" fontStyle="italic" fontSize="33"><tspan x="0">New York.</tspan><tspan x="0" dy="35">Sixteen little</tspan><tspan x="0" dy="35">side quests.</tspan></text><path d="M0 113H116" stroke="#a38e68" /><text y="135" fontFamily="Arial" fontSize="10" letterSpacing="2">FIVE BOROUGHS. ONE CITY.</text></g>
    {[[784,189],[750,215],[901,342],[880,430],[731,669],[703,683],[196,698],[150,710],[356,431],[328,451]].map(([x,y])=><g key={`${x}-${y}`} stroke="#839267" strokeWidth=".7"><path d={`M${x} ${y}v14`} /><circle cx={x} cy={y} r="6" fill="#97ad82" /><circle cx={x+4} cy={y-3} r="5" fill="#b4c397" /></g>)}
    <g className="atlas-ferry" transform="translate(353 618)" stroke="#7b684d"><path d="M0 0H31L25 9H6Z" fill="#bc8357" /><path d="M8 0V-8H23V0ZM14-8V-14" fill="#f2e6c8" /></g>
    <rect x="12" y="12" width="936" height="796" rx="3" fill="none" stroke="#9f9172" strokeWidth=".8" />
    <text x="53" y="788" fill="#81725b" fontFamily="Georgia" fontSize="12" fontStyle="italic">Wander a little. Bring back a story.</text>
  </svg>;
}
