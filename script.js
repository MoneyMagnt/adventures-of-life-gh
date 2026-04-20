"use strict";

document.addEventListener("DOMContentLoaded", () => {
  const WHATSAPP_NUMBER = "233551472190";
  const DEFAULT_WHATSAPP_MESSAGE =
    "Hello Adventures of Life, I want help planning a trip in Ghana or nearby West African countries.";
  const DESKTOP_MENU_BREAKPOINT = 1024;
  const STICKY_OFFSET = 96;
  const FORM_ENDPOINT = "https://formspree.io/f/YOUR_ID";

  const hoverQuery = window.matchMedia("(hover: hover)");
  const reducedMotionQuery = window.matchMedia("(prefers-reduced-motion: reduce)");

  const travelStyleAccents = {
    summit: "accent-gold",
    coast: "accent-lagoon",
    canopy: "accent-canopy",
    north: "accent-clay",
    ada: "accent-lagoon",
    togo: "accent-sand",
  };

  const travelStyles = {
    summit: {
      title: "Hike Adakluto",
      typeLabel: "Adakluto trail day",
      summary: "Trail start, steep climb, and the group photo at the top.",
      audience: "First-time hikers · small groups · people who want a real climb",
      includes: "Trail start / stair sections / summit marker",
      visual: "Trail start",
      imgSrc: "assets/responsive/adakluto-hero-1440.webp",
      imgSrcSet:
        "assets/responsive/adakluto-hero-960.webp 960w, assets/responsive/adakluto-hero-1440.webp 1440w",
      imgSizes: "(min-width: 64rem) 55vw, 100vw",
      fetchPriority: "high",
      imgAlt: "Adventures of Life crew on the Hike Adakluto route.",
      highlights: ["Trail start", "Steep stair section", "Peak marker", "Group summit"],
      storyTitle: "From the first step to the summit photo.",
      storySummary:
        "Adakluto is a proper hiking day. You start easy, hit the steeper sections, reach the marker, take the group photo, and come down feeling like you earned it.",
      gallery: [
        {
          src: "assets/trips/adakluto-beginning-preview.jpg",
          alt: "Early trail start on the Hike Adakluto route.",
          kicker: "Trail start",
          title: "The day starts gently before the real climb kicks in.",
          accent: "accent-gold",
          position: "center 46%",
        },
        {
          src: "assets/trips/adakluto-trail-preview.jpg",
          alt: "Trail frame from Hike Adakluto.",
          kicker: "Trail section",
          title: "This is where the route starts asking a bit more from you.",
          accent: "accent-clay",
          position: "center 48%",
        },
        {
          src: "assets/responsive/adakluto-ridge-close-1440.webp",
          alt: "Steeper section on Hike Adakluto.",
          kicker: "Steep section",
          title: "The steeper section is where the group settles into a rhythm.",
          accent: "accent-gold",
          position: "center 38%",
        },
        {
          src: "assets/trips/adakluto-peak-preview.jpg",
          alt: "Peak marker on Hike Adakluto.",
          kicker: "Peak marker",
          title: "At the top, everyone stops for the photo they worked for.",
          accent: "accent-lagoon",
          position: "center 44%",
        },
        {
          src: "assets/responsive/adakluto-group-peak-1440.webp",
          alt: "Peak group frame from Hike Adakluto.",
          kicker: "Group summit",
          title: "The summit photo is the part people post first.",
          accent: "accent-canopy",
          position: "center 46%",
        },
      ],
      style: "summit",
    },
    coast: {
      title: "Keta 3 Days",
      typeLabel: "Beach camp weekend",
      summary: "Tent village, fort stop, sea air, and a long beach weekend.",
      audience: "Weekend crews · social travellers · beach people",
      includes: "Keta / Fort Prinzenstein / beach camp",
      visual: "Beach camp",
      imgSrc: "assets/trips/keta-camp.webp",
      imgAlt: "Beach camp route preview from the Keta trip.",
      highlights: ["Beach camp", "Fort stop", "Sunrise water", "Full crew energy"],
      storyTitle: "Keta feels bigger every time the day opens up.",
      storySummary:
        "You settle into camp, move between the fort and the beach, stay up later than planned, and wake up to sea air again.",
      gallery: [
        {
          src: "assets/trips/keta-tent-village-2-preview.jpg",
          alt: "Tent village frame from the Keta trip.",
          kicker: "Tent village",
          title: "The trip starts feeling real once the tents are up.",
          accent: "accent-gold",
          position: "center 46%",
        },
        {
          src: "assets/trips/fort-pr.webp",
          alt: "Fort stop during the Keta trip.",
          kicker: "Fort stop",
          title: "The fort gives the weekend some weight.",
          accent: "accent-lagoon",
          position: "center 52%",
        },
        {
          src: "assets/trips/keta-beachline.webp",
          alt: "Beachline frame from the Keta trip.",
          kicker: "Shoreline",
          title: "By the end, nobody wants to rush back home.",
          accent: "accent-lagoon",
          position: "center 48%",
        },
      ],
      style: "coast",
    },
    canopy: {
      title: "Asenema Waterfalls",
      typeLabel: "Forest waterfall day",
      summary: "Forest walk, cold waterfall, and a relaxed group day.",
      audience: "Nature lovers · easygoing groups · people who want water at the end",
      includes: "Asenema entrance / waterfall trail / forest route",
      visual: "Waterfall day",
      imgSrc: "assets/trips/asenema-group-preview.jpg",
      imgAlt: "Adventures of Life group at Asenema Waterfalls.",
      highlights: ["Entrance climb", "Waterfall arrival", "Group swim", "Forest photos"],
      storyTitle: "The forest keeps pulling you toward the water.",
      storySummary:
        "Asenema is the kind of trip where the walk stays light, the water does the talking, and the group settles quickly.",
      gallery: [
        {
          src: "assets/trips/asenema-entrance-preview.jpg",
          alt: "Trail entrance at Asenema Waterfalls.",
          kicker: "Trail entry",
          title: "Even the entrance feels like the day is changing.",
          accent: "accent-gold",
          position: "center 44%",
        },
        {
          src: "assets/trips/asenema-waterfalls.webp",
          alt: "Waterfall arrival at Asenema.",
          kicker: "Falls arrival",
          title: "Then you hear the water before you fully see it.",
          accent: "accent-lagoon",
          position: "center 46%",
        },
        {
          src: "assets/trips/asenema-fitcheck-preview.jpg",
          alt: "Fitcheck portrait from the Asenema Waterfalls trip.",
          kicker: "Quiet beat",
          title: "The quieter moments on this trip happen naturally.",
          accent: "accent-lagoon",
          position: "center 44%",
        },
        {
          src: "assets/trips/asenema-crew.webp",
          alt: "Crew moment at Asenema Waterfalls.",
          kicker: "Crew moment",
          title: "Once people reach the water, everyone loosens up.",
          accent: "accent-canopy",
          position: "center 42%",
        },
      ],
      style: "canopy",
    },
    north: {
      title: "Akwamu Gorge",
      typeLabel: "Gorge climb day",
      summary: "Steep climb, tired legs, and a view worth the effort.",
      audience: "Fit groups · challenge seekers · people who do not mind sweating for the view",
      includes: "Akwamu Gorge / summit trail / canopy stop",
      visual: "At the top",
      imgSrc: "assets/responsive/akwamu-overlook-1440.webp",
      imgSrcSet:
        "assets/responsive/akwamu-overlook-960.webp 960w, assets/responsive/akwamu-overlook-1440.webp 1440w",
      imgSizes: "(min-width: 64rem) 55vw, 100vw",
      imgAlt: "Peak view on the Akwamu Gorge route.",
      highlights: ["Station meet-up", "Gorge climb", "View at the top", "Canopy stop"],
      storyTitle: "Akwamu is hard on the legs and worth it at the top.",
      storySummary:
        "The climb bites early, the group keeps pushing, and the view at the top changes everybody's face.",
      gallery: [
        {
          src: "assets/trips/akwamu-peak-preview.jpg",
          alt: "Peak view from Akwamu Gorge.",
          kicker: "Peak pull",
          title: "This is the view that makes the climb make sense.",
          accent: "accent-clay",
          position: "center 40%",
        },
        {
          src: "assets/responsive/akwamu-climb-portrait-1440.webp",
          alt: "Climb portrait on the Akwamu Gorge route.",
          kicker: "On the climb",
          title: "Before the top, there is the part where everybody gets serious.",
          accent: "accent-clay",
          position: "center 40%",
        },
        {
          src: "assets/responsive/akwamu-gorge-team-1440.webp",
          alt: "Crew frame on the Akwamu Gorge route.",
          kicker: "Crew moment",
          title: "By the middle of the climb, everyone is already in it together.",
          accent: "accent-gold",
          position: "center 38%",
        },
        {
          src: "assets/trips/akwamu-boat.webp",
          alt: "Boat-side frame connected to the Akwamu Gorge route.",
          kicker: "Water break",
          title: "The water break changes the pace at the right time.",
          accent: "accent-lagoon",
          position: "center 48%",
        },
        {
          src: "assets/responsive/akwamu-crew-1280.webp",
          alt: "Ridge frame during the Akwamu Gorge climb.",
          kicker: "Ridge stop",
          title: "Once you get higher, people start smiling again.",
          accent: "accent-lagoon",
          position: "center 44%",
        },
        {
          src: "assets/responsive/akwamu-gorge-team-1440.webp",
          alt: "Group frame from the Akwamu Gorge trip.",
          kicker: "Crew moment",
          title: "The tougher days are where the group starts feeling like one.",
          accent: "accent-gold",
          position: "center 44%",
        },
      ],
      style: "north",
    },
    ada: {
      title: "Ada / Nkyinkyim Museum",
      typeLabel: "Museum / lagoon day",
      summary: "Museum grounds, water crossing, portraits, and an easy day out.",
      audience: "Culture lovers · slower groups · people who want a softer day",
      includes: "Nkyinkyim Museum / Ada / lagoon crossing",
      visual: "Museum grounds",
      imgSrc: "assets/responsive/ada-nkyinkyim-candid-1440.webp",
      imgSrcSet:
        "assets/responsive/ada-nkyinkyim-candid-960.webp 960w, assets/responsive/ada-nkyinkyim-candid-1440.webp 1440w",
      imgSizes: "(min-width: 64rem) 55vw, 100vw",
      imgAlt: "Ada and Nkyinkyim Museum route preview.",
      highlights: ["Museum grounds", "Boat crossing", "Group photos", "Water stop"],
      storyTitle: "Ada gives the group more room to slow down.",
      storySummary:
        "You start in the museum grounds, move toward the water, take your time with the portraits, and end the day calmer than you started it.",
      gallery: [
        {
          src: "assets/responsive/ada-nkyinkyim-portrait-close-1440.webp",
          alt: "Single portrait from Ada and Nkyinkyim Museum.",
          kicker: "Portrait beat",
          title: "The quieter photos come naturally here.",
          accent: "accent-lagoon",
          position: "center 38%",
        },
        {
          src: "assets/responsive/ada-nkyinkyim-boat-ride-1440.webp",
          alt: "Boat ride frame from Ada and Nkyinkyim Museum.",
          kicker: "Boat crossing",
          title: "The water crossing changes the rhythm of the day.",
          accent: "accent-clay",
          position: "center 46%",
        },
        {
          src: "assets/responsive/ada-nkyinkyim-water-edge-1440.webp",
          alt: "Water-edge frame from Ada and Nkyinkyim Museum.",
          kicker: "Water edge",
          title: "By the water, everything slows down a little.",
          accent: "accent-canopy",
          position: "center 48%",
        },
        {
          src: "assets/responsive/ada-nkyinkyim-monument-group-1440.webp",
          alt: "Group frame from Ada and Nkyinkyim Museum.",
          kicker: "Monument group",
          title: "The museum grounds give the whole group a place to gather.",
          accent: "accent-lagoon",
          position: "center 44%",
        },
      ],
      style: "ada",
    },
    togo: {
      title: "Togo",
      typeLabel: "Fresh off the road",
      summary: "The trip is done. The first edit, route notes, and full gallery are landing next.",
      audience: "Early joiners · cross-border travellers · people watching for the next drop",
      includes: "Trip notes / photo selects / full gallery soon",
      visual: "Just back",
      imgSrc: "assets/togo-preview.svg",
      imgAlt: "Togo trip placeholder while the full gallery is being prepared.",
      highlights: ["Trip completed", "Photos sorting", "Gallery soon", "Inquiry open"],
      storyTitle: "Togo just landed. Full story next.",
      storySummary:
        "The trip is done. The team is sorting the photos, route notes, and best moments before the full Togo page goes live.",
      gallery: [
        {
          src: "assets/togo-preview.svg",
          alt: "Togo placeholder marking that the trip just returned.",
          kicker: "Just back",
          title: "We have just come off the road and the first edit is still being built.",
          accent: "accent-sand",
          position: "center center",
        },
        {
          src: "assets/togo-route.svg",
          alt: "Togo route notes placeholder.",
          kicker: "Route notes",
          title: "The strongest stops and story beats are being pulled together now.",
          accent: "accent-lagoon",
          position: "center center",
        },
        {
          src: "assets/togo-gallery.svg",
          alt: "Togo gallery placeholder.",
          kicker: "Photo selects",
          title: "If you want first access when it lands, ask about the next trip early.",
          accent: "accent-canopy",
          position: "center center",
        },
      ],
      style: "togo",
    },
  };

  const roadmapPosterSrc = "adventurepics/Roadmap.jpg";

  const yearRoutes = {
    shai: {
      title: "Shai Hills & Kwaminga Park",
      typeLabel: "23rd May · Domestic opener",
      summary:
        "The year opens on park ground: open terrain, wildlife energy, and the first confirmed date from the official 2026 poster.",
      audience: "Early joiners · park day people · domestic crews",
      includes: "Shai Hills / Kwaminga Park / official opener",
      visual: "Official poster",
      imgSrc: roadmapPosterSrc,
      imgAlt: "Official Adventures of Life 2026 roadmap poster highlighting Shai Hills and Kwaminga Park.",
      highlights: ["23rd May", "Park route", "Domestic opener", "Official release"],
      storyTitle: "The official poster is where the year now starts.",
      storySummary:
        "Shai Hills and Kwaminga Park is the first fixed date on the roadmap, so the story begins with the published poster itself.",
      gallery: [
        {
          src: roadmapPosterSrc,
          alt: "Official Adventures of Life 2026 roadmap poster.",
          kicker: "Official poster",
          title: "This chapter is no longer a placeholder. It is locked into the public 2026 release.",
          accent: "accent-gold",
          position: "center 14%",
        },
        {
          src: roadmapPosterSrc,
          alt: "2026 roadmap poster showing the published list of Adventures of Life trips.",
          kicker: "Date list",
          title: "May 23 sits at the top of the list as the domestic opener for the whole year.",
          accent: "accent-lagoon",
          position: "center 58%",
        },
        {
          src: "assets/togo-route.svg",
          alt: "Editorial route note graphic for the selected 2026 roadmap chapter.",
          kicker: "Field note",
          title: "Once the poster locks the date, the route details and logistics sharpen behind it.",
          accent: "accent-canopy",
          position: "center center",
        },
      ],
      style: "summit",
    },
    waterfall: {
      title: "Waterfall",
      typeLabel: "27th June · Domestic trip",
      summary:
        "June keeps the rhythm cool and simple: forest air, water at the end, and a soft reset after the opening park run.",
      audience: "Nature lovers · easygoing groups · first timers",
      includes: "Waterfall route / forest air / domestic reset",
      visual: "Waterfall route",
      imgSrc: "assets/trips/asenema-waterfalls.webp",
      imgAlt: "Waterfall preview for the June Adventures of Life chapter.",
      highlights: ["27th June", "Waterfall route", "Forest reset", "Domestic trip"],
      storyTitle: "June turns the year toward water.",
      storySummary:
        "The roadmap keeps June simple on purpose: a waterfall chapter that cools the pace and lets the group settle.",
      gallery: [
        {
          src: "assets/trips/asenema-entrance-preview.jpg",
          alt: "Waterfall route entrance mood reference for the June chapter.",
          kicker: "Trail entry",
          title: "June should feel like a cleaner, easier approach into the day before the water shows itself.",
          accent: "accent-gold",
          position: "center 44%",
        },
        {
          src: "assets/trips/asenema-waterfalls.webp",
          alt: "Waterfall mood reference for the June Adventures of Life chapter.",
          kicker: "Falls arrival",
          title: "By the time the water appears, the pace of the month changes with it.",
          accent: "accent-lagoon",
          position: "center 46%",
        },
        {
          src: "assets/trips/asenema-fitcheck-preview.jpg",
          alt: "Quiet portrait mood reference for the June waterfall chapter.",
          kicker: "Quiet beat",
          title: "This chapter is less about proving something and more about letting the day breathe properly.",
          accent: "accent-lagoon",
          position: "center 44%",
        },
        {
          src: "assets/trips/asenema-crew.webp",
          alt: "Crew mood reference for the June waterfall chapter.",
          kicker: "Crew moment",
          title: "By the water, even the quieter groups start feeling like a crew.",
          accent: "accent-canopy",
          position: "center 42%",
        },
      ],
      style: "canopy",
    },
    coteIvoire: {
      title: "4 Days in Côte d'Ivoire",
      typeLabel: "27th August · International run",
      summary:
        "August is the first long border chapter on the poster: passports out, four days on the road, and the calendar suddenly feels bigger.",
      audience: "Passport-ready travellers · cross-border crews · early list people",
      includes: "Côte d'Ivoire / 4-day run / international chapter",
      visual: "Border chapter",
      imgSrc: roadmapPosterSrc,
      imgAlt: "Official Adventures of Life 2026 roadmap poster featuring the Côte d'Ivoire chapter.",
      highlights: ["27th August", "4 days", "Côte d'Ivoire", "Border run"],
      storyTitle: "August is where the roadmap leaves Ghana.",
      storySummary:
        "The first border run is already printed on the official poster, which makes August the chapter that stretches the year west.",
      gallery: [
        {
          src: roadmapPosterSrc,
          alt: "Official Adventures of Life 2026 roadmap poster featuring the Côte d'Ivoire chapter.",
          kicker: "Poster proof",
          title: "Côte d'Ivoire is already published as a four-day run on the 2026 roadmap.",
          accent: "accent-sand",
          position: "center 58%",
        },
        {
          src: "assets/togo-route.svg",
          alt: "Editorial route note graphic for a cross-border Adventures of Life chapter.",
          kicker: "Route note",
          title: "This is the kind of chapter where logistics, passports, and pacing matter as much as the destination.",
          accent: "accent-lagoon",
          position: "center center",
        },
        {
          src: roadmapPosterSrc,
          alt: "Adventures of Life 2026 roadmap poster with the date list and contact band.",
          kicker: "Locked date",
          title: "Once the four-day August slot is printed, the smartest move is getting onto the early inquiry list.",
          accent: "accent-gold",
          position: "center 84%",
        },
      ],
      style: "togo",
    },
    wli: {
      title: "Wli Waterfalls Camp",
      typeLabel: "24th October · Domestic camp",
      summary:
        "October makes the waterfall chapter bigger: longer road energy, camp mood, and a weekend that feels properly away from the city.",
      audience: "Camp people · waterfall lovers · weekend crews",
      includes: "Wli Waterfalls / camp chapter / domestic route",
      visual: "Camp chapter",
      imgSrc: "assets/trips/asenema-group-preview.jpg",
      imgAlt: "Waterfall camp mood reference for the October Adventures of Life chapter.",
      highlights: ["24th October", "Wli Waterfalls", "Camp chapter", "Domestic trip"],
      storyTitle: "October is the waterfall chapter with more weight to it.",
      storySummary:
        "Wli stretches the waterfall idea into a camp weekend, which gives this part of the roadmap more distance and more atmosphere.",
      gallery: [
        {
          src: "assets/trips/asenema-entrance-preview.jpg",
          alt: "Waterfall route entrance mood reference for the October chapter.",
          kicker: "Long approach",
          title: "The camp version of a waterfall chapter should feel like a proper approach, not a quick stop.",
          accent: "accent-gold",
          position: "center 44%",
        },
        {
          src: "assets/trips/asenema-waterfalls.webp",
          alt: "Waterfall mood reference for the October chapter.",
          kicker: "Falls arrival",
          title: "Cold water is still the payoff. October just gives it a longer frame around it.",
          accent: "accent-lagoon",
          position: "center 46%",
        },
        {
          src: "assets/trips/asenema-crew.webp",
          alt: "Crew mood reference for the October waterfall camp chapter.",
          kicker: "Camp energy",
          title: "Once the group settles in, the route stops feeling like a schedule and starts feeling like a trip.",
          accent: "accent-canopy",
          position: "center 42%",
        },
      ],
      style: "canopy",
    },
    amedzofe: {
      title: "Amedzofe",
      typeLabel: "28th November · Highland chapter",
      summary:
        "November climbs back into cooler air: highland roads, ridge mood, and the last home chapter before the year crosses out again.",
      audience: "Highland people · hikers · visual seekers",
      includes: "Amedzofe / Volta highlands / domestic chapter",
      visual: "Highland route",
      imgSrc: "assets/responsive/adakluto-peak-wide-1440.webp",
      imgSrcSet:
        "assets/responsive/adakluto-peak-wide-960.webp 960w, assets/responsive/adakluto-peak-wide-1440.webp 1440w",
      imgSizes: "(min-width: 64rem) 35vw, 100vw",
      imgAlt: "Highland mood reference for the Amedzofe chapter.",
      highlights: ["28th November", "Amedzofe", "Highland air", "Volta chapter"],
      storyTitle: "November brings the year back into the highlands.",
      storySummary:
        "Amedzofe works as the calm climb before the finale: cooler air, longer views, and a route that feels more reflective than loud.",
      gallery: [
        {
          src: "assets/responsive/adakluto-peak-wide-1440.webp",
          alt: "Highland wide frame used as a mood reference for the Amedzofe chapter.",
          kicker: "Highland mood",
          title: "Amedzofe should feel like cool air, longer sightlines, and a quieter kind of movement.",
          accent: "accent-gold",
          position: "center 42%",
        },
        {
          src: "assets/responsive/adakluto-ridge-close-1440.webp",
          alt: "Ridge mood reference for the Amedzofe chapter.",
          kicker: "Ridge line",
          title: "The highland chapter needs a route with shape, not just a destination pin.",
          accent: "accent-clay",
          position: "center 38%",
        },
        {
          src: "assets/responsive/adakluto-group-peak-1440.webp",
          alt: "Group summit style mood reference for the Amedzofe chapter.",
          kicker: "Group frame",
          title: "By November, the strongest trips already feel like a crew by the time the photo lands.",
          accent: "accent-canopy",
          position: "center 46%",
        },
      ],
      style: "summit",
    },
    benin: {
      title: "Benin / End Of Year Party",
      typeLabel: "December · International finale",
      summary:
        "The last chapter is built like a send-off: one more border crossing, a party at the end of the year, and the cleanest close on the poster.",
      audience: "Finale people · passport-ready travellers · year-end crews",
      includes: "Benin / end-of-year party / international finale",
      visual: "Finale chapter",
      imgSrc: roadmapPosterSrc,
      imgAlt: "Official Adventures of Life 2026 roadmap poster featuring the Benin end-of-year party finale.",
      highlights: ["December", "Benin", "End-of-year party", "International finale"],
      storyTitle: "Benin closes the roadmap like a proper finale.",
      storySummary:
        "The poster does not leave the last chapter vague. December is Benin and the end-of-year party, which gives the whole year a real last page.",
      gallery: [
        {
          src: roadmapPosterSrc,
          alt: "Official Adventures of Life 2026 roadmap poster featuring the Benin finale.",
          kicker: "Finale locked",
          title: "The year already knows how it ends: Benin and the end-of-year party in December.",
          accent: "accent-sand",
          position: "center 74%",
        },
        {
          src: "assets/togo-route.svg",
          alt: "Editorial route note graphic for the year-end border finale.",
          kicker: "Border note",
          title: "Finale chapters need more than hype. They need enough runway for people to commit early.",
          accent: "accent-lagoon",
          position: "center center",
        },
        {
          src: roadmapPosterSrc,
          alt: "Adventures of Life 2026 roadmap poster showing the trip list and contact details.",
          kicker: "Last call",
          title: "The people who read the poster early usually get the best shot at the final list before it tightens.",
          accent: "accent-gold",
          position: "center 88%",
        },
      ],
      style: "togo",
    },
  };

  const yearTripSchedule = {
    may: {
      month: "23 May",
      label: "Domestic opener",
      kind: "domestic",
      region: "Shai Hills / Kwaminga Park · Ghana",
      mapZone: "Shai belt",
      format: "Park day chapter",
      status: "Locked on the 2026 poster",
      note:
        "The first slot is already public, which makes it the clearest place for the year to begin: one domestic opener that gets the group's chemistry moving early.",
      route: yearRoutes.shai,
    },
    june: {
      month: "27 June",
      label: "Domestic trip",
      kind: "domestic",
      region: "Waterfall route · Ghana",
      mapZone: "Waterfall line",
      format: "Forest reset chapter",
      status: "Confirmed on the roadmap",
      note:
        "June is the cool-down chapter. After the opener, the year eases into water, shade, and a softer day on the ground.",
      route: yearRoutes.waterfall,
    },
    august: {
      month: "27 August",
      label: "International run",
      kind: "international",
      region: "Côte d'Ivoire · West Africa",
      mapZone: "Côte d'Ivoire corridor",
      format: "4-day border chapter",
      status: "Printed on the 2026 poster",
      note:
        "August is not a rumor anymore. It is the first four-day international chapter already locked into the official release.",
      route: yearRoutes.coteIvoire,
    },
    october: {
      month: "24 October",
      label: "Domestic camp",
      kind: "domestic",
      region: "Wli Waterfalls · Ghana",
      mapZone: "Volta waterfall belt",
      format: "Camp weekend chapter",
      status: "Confirmed on the roadmap",
      note:
        "October gives the year its longer waterfall chapter: more road, more time outside, and a camp frame around the route.",
      route: yearRoutes.wli,
    },
    november: {
      month: "28 November",
      label: "Highland chapter",
      kind: "domestic",
      region: "Amedzofe · Ghana",
      mapZone: "Volta highlands",
      format: "Cool-air climb chapter",
      status: "Confirmed on the roadmap",
      note:
        "Amedzofe sits in the right place on the calendar: the last home chapter before the year crosses the border again.",
      route: yearRoutes.amedzofe,
    },
    december: {
      month: "December",
      label: "International finale",
      kind: "international",
      region: "Benin · West Africa",
      mapZone: "Benin finale",
      format: "End-of-year party chapter",
      status: "Finale already announced",
      note:
        "Benin closes the year as the last border chapter and the end-of-year party, which gives the whole roadmap a proper finish.",
      route: yearRoutes.benin,
    },
  };

  const yearTripOrder = Object.keys(yearTripSchedule);

  const clamp = (value, min, max) => Math.min(max, Math.max(min, value));
  const lerp = (start, end, factor) => start + (end - start) * factor;
  const prefersReducedMotion = () => reducedMotionQuery.matches;
  const isModifiedClick = (event) =>
    event.defaultPrevented ||
    event.button !== 0 ||
    event.metaKey ||
    event.ctrlKey ||
    event.shiftKey ||
    event.altKey;
  const easeInOutCubic = (progress) =>
    progress < 0.5 ? 4 * progress * progress * progress : 1 - Math.pow(-2 * progress + 2, 3) / 2;

  const ensureIconSprite = () => {
    if (!document.getElementById("aol-icon-sprite")) {
      console.warn("Missing inline social icon sprite.");
    }
  };

  const buildWhatsAppLink = (message) => {
    const encodedMessage = encodeURIComponent((message || DEFAULT_WHATSAPP_MESSAGE).trim());
    return `https://wa.me/${WHATSAPP_NUMBER}?text=${encodedMessage}`;
  };

  const setWhatsAppHref = (link, message) => {
    if (!link) {
      return;
    }

    const resolvedMessage = message || link.dataset.message || DEFAULT_WHATSAPP_MESSAGE;
    link.dataset.message = resolvedMessage;
    link.setAttribute("href", buildWhatsAppLink(resolvedMessage));
    link.setAttribute("target", "_blank");
    link.setAttribute("rel", "noreferrer");
  };

  const buildInquiryMessage = ({
    routeTitle = "",
    name = "",
    email = "",
    interest = "",
    notes = "",
  } = {}) => {
    const selectedTrip = routeTitle || interest || "a trip";
    const lines = [
      "Hello Adventures of Life,",
      `I want to ask about ${selectedTrip}.`,
    ];

    if (name) {
      lines.push(`Name: ${name}`);
    }

    if (email) {
      lines.push(`Email: ${email}`);
    }

    if (interest && !routeTitle) {
      lines.push(`Trip: ${interest}`);
    }

    if (notes) {
      lines.push(`Notes: ${notes}`);
    }

    lines.push("Please let me know the next step.");
    return lines.join("\n");
  };
  const findHashTarget = (hash) => {
    const rawId = hash.replace(/^#/, "");

    if (!rawId) {
      return null;
    }

    const decodedId = decodeURIComponent(rawId);
    const byId = document.getElementById(decodedId);

    if (byId) {
      return byId;
    }

    try {
      return document.querySelector(hash);
    } catch (error) {
      return null;
    }
  };

  const scrollToY = (targetY, behavior = "smooth") => {
    const maxScroll = Math.max(0, document.documentElement.scrollHeight - window.innerHeight);
    const finalY = clamp(targetY, 0, maxScroll);

    if (behavior === "auto" || prefersReducedMotion()) {
      window.scrollTo(0, finalY);
      return;
    }

    const startY = window.scrollY;
    const deltaY = finalY - startY;
    const duration = 620;
    let startTime = 0;

    const step = (timestamp) => {
      if (!startTime) {
        startTime = timestamp;
      }

      const progress = clamp((timestamp - startTime) / duration, 0, 1);
      const eased = easeInOutCubic(progress);
      window.scrollTo(0, startY + deltaY * eased);

      if (progress < 1) {
        window.requestAnimationFrame(step);
      }
    };

    window.requestAnimationFrame(step);
  };

  const scrollToHash = (hash, behavior = "smooth") => {
    const target = findHashTarget(hash);

    if (!target) {
      return;
    }

    const targetY = target.getBoundingClientRect().top + window.scrollY - STICKY_OFFSET;
    scrollToY(targetY, behavior);
  };

  const refreshVisualImage = (image, { immediate = false } = {}) => {
    if (!image) {
      return;
    }

    const isVisualPhoto = image.classList.contains("visual-photo");

    if (isVisualPhoto) {
      image.style.setProperty("--photo-filter", "blur(8px)");
      image.style.setProperty("--photo-scale", "1.04");
      image.style.setProperty("--photo-opacity", "0.6");
    } else {
      image.style.filter = "blur(8px)";
      image.style.transform = "scale(1.04)";
      image.style.opacity = "0.6";
      image.style.transition = "filter 400ms ease, transform 400ms ease, opacity 400ms ease";
    }

    const reveal = () => {
      if (isVisualPhoto) {
        image.style.setProperty("--photo-filter", "none");
        image.style.setProperty("--photo-scale", "1.01");
        image.style.setProperty("--photo-opacity", "1");
        return;
      }

      image.style.filter = "none";
      image.style.transform = "scale(1)";
      image.style.opacity = "1";
    };

    if (immediate || (image.complete && image.naturalWidth > 0)) {
      window.requestAnimationFrame(reveal);
      return;
    }

    image.addEventListener("load", reveal, { once: true });
    image.addEventListener("error", reveal, { once: true });
  };

  const setupWhatsAppLinks = () => {
    const links = document.querySelectorAll("[data-whatsapp-link]");
    const noteTargets = document.querySelectorAll("[data-whatsapp-note]");

    links.forEach((link) => {
      setWhatsAppHref(link, link.dataset.message || DEFAULT_WHATSAPP_MESSAGE);
    });

    noteTargets.forEach((note) => {
      note.textContent = "WhatsApp is ready for live trip inquiries.";
    });
  };

  const setupMobileMenu = () => {
    const toggle = document.querySelector("[data-menu-toggle]");
    const panel = document.querySelector("[data-menu-panel]");

    if (!toggle || !panel) {
      return;
    }

    const closeMenu = () => {
      panel.classList.remove("is-open");
      toggle.setAttribute("aria-expanded", "false");
    };

    toggle.addEventListener("click", () => {
      const isOpen = panel.classList.toggle("is-open");
      toggle.setAttribute("aria-expanded", String(isOpen));
    });

    panel.querySelectorAll("a").forEach((link) => {
      link.addEventListener("click", () => {
        if (window.innerWidth < DESKTOP_MENU_BREAKPOINT) {
          closeMenu();
        }
      });
    });

    document.addEventListener("keydown", (event) => {
      if (event.key === "Escape") {
        closeMenu();
      }
    });

    window.addEventListener("resize", () => {
      if (window.innerWidth >= DESKTOP_MENU_BREAKPOINT) {
        closeMenu();
      }
    });
  };

  const setupRevealAnimations = () => {
    const items = document.querySelectorAll(".reveal, .reveal-left, .reveal-right, .reveal-scale");

    if (!items.length) {
      return;
    }

    if (prefersReducedMotion() || !("IntersectionObserver" in window)) {
      items.forEach((item) => item.classList.add("is-visible"));
      return;
    }

    const observer = new IntersectionObserver(
      (entries, currentObserver) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) {
            return;
          }

          entry.target.classList.add("is-visible");
          currentObserver.unobserve(entry.target);
        });
      },
      {
        threshold: 0.12,
        rootMargin: "0px 0px -60px 0px",
      }
    );

    items.forEach((item) => observer.observe(item));
  };

  const highlightCurrentPage = () => {
    const currentPage = document.body.dataset.page;

    if (!currentPage) {
      return;
    }

    document.querySelectorAll("[data-nav-page]").forEach((link) => {
      const isCurrent = link.dataset.navPage === currentPage;
      link.classList.toggle("is-active", isCurrent);

      if (isCurrent) {
        link.setAttribute("aria-current", "page");
      }
    });
  };

  const setupHeroParallax = () => {
    if (!hoverQuery.matches || prefersReducedMotion()) {
      return;
    }

    const heroPhotos = document.querySelectorAll(".hero .visual-placeholder .visual-photo");

    if (!heroPhotos.length) {
      return;
    }

    let rafPending = false;

    const requestTick = () => {
      if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
        return;
      }

      if (!rafPending) {
        rafPending = true;
        window.requestAnimationFrame(() => {
          const offset = clamp(window.scrollY * 0.25, -40, 40);
          heroPhotos.forEach((photo) => photo.style.setProperty("--photo-shift", `${offset}px`));
          rafPending = false;
        });
      }
    };

    requestTick();
    window.addEventListener("scroll", requestTick, { passive: true });
    window.addEventListener("resize", requestTick, { passive: true });
  };

  const setupAtlasTilt = () => {
    const stage = document.querySelector(".atlas-stage");

    if (!stage || !hoverQuery.matches || prefersReducedMotion()) {
      return;
    }

    let targetX = 0;
    let targetY = 0;
    let currentX = 0;
    let currentY = 0;
    let frameId = 0;
    let rafPending = false;

    const renderTilt = () => {
      currentX = lerp(currentX, targetX, 0.08);
      currentY = lerp(currentY, targetY, 0.08);

      stage.style.setProperty("--parallax-x", currentX.toFixed(2));
      stage.style.setProperty("--parallax-y", currentY.toFixed(2));

      if (Math.abs(targetX - currentX) > 0.01 || Math.abs(targetY - currentY) > 0.01) {
        frameId = window.requestAnimationFrame(renderTilt);
      } else {
        frameId = 0;
      }
    };

    const queueTilt = () => {
      if (!frameId) {
        frameId = window.requestAnimationFrame(renderTilt);
      }
    };

    stage.addEventListener("mousemove", (event) => {
      if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
        return;
      }

      if (!rafPending) {
        rafPending = true;
        window.requestAnimationFrame(() => {
          const rect = stage.getBoundingClientRect();

          if (rect.width && rect.height) {
            const nx = (event.clientX - rect.left) / rect.width - 0.5;
            const ny = (event.clientY - rect.top) / rect.height - 0.5;

            targetX = clamp(nx * 16, -16, 16);
            targetY = clamp(ny * 12, -12, 12);
            queueTilt();
          }

          rafPending = false;
        });
      }
    });

    stage.addEventListener("mouseleave", () => {
      targetX = 0;
      targetY = 0;
      queueTilt();
    });
  };

  const setupJourneyAtlas = () => {
    const atlas = document.querySelector(".journey-year-atlas");
    const stops = Array.from(atlas?.querySelectorAll(".journey-road-stop[data-year-stop]") ?? []);
    const monthLabel = document.getElementById("year-month-label");
    const month = document.getElementById("year-route-month");
    const title = document.getElementById("year-route-title");
    const summary = document.getElementById("year-route-summary");
    const region = document.getElementById("year-route-region");
    const format = document.getElementById("year-route-format");
    const status = document.getElementById("year-route-status");
    const note = document.getElementById("year-route-note");
    const visualLabel = document.getElementById("year-route-visual-label");
    const highlights = document.getElementById("year-route-highlights");
    const progressFill = document.getElementById("year-progress-fill");
    const routeCounter = document.getElementById("year-route-counter");
    const routePill = document.getElementById("year-route-pill");
    const filmstrip = document.querySelector(".journey-filmstrip");
    const galleryTitle = document.getElementById("year-gallery-title");
    const gallerySummary = document.getElementById("year-gallery-summary");
    const storyGallery = document.getElementById("year-gallery");
    const stageFrame = document.getElementById("year-stage-frame");
    const stageImage = document.getElementById("year-stage-img");
    const stageKicker = document.getElementById("year-stage-kicker");
    const stageTitle = document.getElementById("year-stage-title");
    const stageOpen = document.getElementById("year-stage-open");
    const routeCta = document.getElementById("year-route-cta");
    const lightbox = document.getElementById("journey-lightbox");
    const lightboxImage = document.getElementById("journey-lightbox-img");
    const lightboxKicker = document.getElementById("journey-lightbox-kicker");
    const lightboxTitle = document.getElementById("journey-lightbox-title");
    const lightboxClose = document.getElementById("journey-lightbox-close");
    const lightboxBackdrop = lightbox?.querySelector("[data-lightbox-close]");

    let activeGalleryRoute = null;
    let activeGalleryIndex = 0;

    if (
      !atlas ||
      !stops.length ||
      !monthLabel ||
      !month ||
      !title ||
      !summary ||
      !region ||
      !format ||
      !status ||
      !note ||
      !visualLabel ||
      !highlights ||
      !progressFill ||
      !routeCounter ||
      !routePill ||
      !filmstrip ||
      !storyGallery ||
      !stageFrame ||
      !stageImage ||
      !stageKicker ||
      !stageTitle
    ) {
      return;
    }

    const setActiveStops = (key) => {
      stops.forEach((stop) => {
        const isActive = stop.dataset.yearStop === key;
        stop.classList.toggle("is-active", isActive);
        stop.setAttribute("aria-selected", String(isActive));
      });
    };

    const setFrameAccent = (frame, styleKey, itemAccent) => {
      if (!frame) {
        return;
      }

      Object.values(travelStyleAccents).forEach((accentClass) => {
        frame.classList.remove(accentClass);
      });

      const accentClass = itemAccent || travelStyleAccents[styleKey];

      if (accentClass) {
        frame.classList.add(accentClass);
      }
    };

    const getThumbSrc = (src) => {
      if (typeof src !== "string") {
        return src;
      }

      if (src.includes("-1440.webp")) {
        return src.replace("-1440.webp", "-960.webp");
      }

      if (src.includes("-1280.webp")) {
        return src.replace("-1280.webp", "-960.webp");
      }

      return src;
    };

    const getStopDate = (stop) => {
      const raw = stop.dataset.stopDate;

      if (!raw) {
        return null;
      }

      const parsed = new Date(`${raw}T00:00:00`);
      return Number.isNaN(parsed.getTime()) ? null : parsed;
    };

    const setYearProgress = () => {
      const now = new Date();
      const start = new Date(now.getFullYear(), 0, 1);
      const end = new Date(now.getFullYear() + 1, 0, 1);
      const progress = clamp(((now - start) / (end - start)) * 100, 0, 100);

      progressFill.style.width = prefersReducedMotion() ? `${progress}%` : "0%";

      if (!prefersReducedMotion()) {
        window.requestAnimationFrame(() => {
          window.requestAnimationFrame(() => {
            progressFill.style.width = `${progress}%`;
          });
        });
      }
    };

    const setNextStop = () => {
      const now = new Date();
      let nextStop = null;

      for (const stop of stops) {
        const stopDate = getStopDate(stop);

        if (stopDate && stopDate >= now) {
          nextStop = stop;
          break;
        }
      }

      if (!nextStop) {
        nextStop = stops[stops.length - 1] || null;
      }

      stops.forEach((stop) => {
        stop.classList.toggle("is-next", stop === nextStop);
      });
    };

    const openLightbox = () => {
      if (!lightbox || !activeGalleryRoute) {
        return;
      }

      const item = activeGalleryRoute.gallery?.[activeGalleryIndex];

      if (!item || !lightboxImage || !lightboxKicker || !lightboxTitle) {
        return;
      }

      lightbox.hidden = false;
      lightbox.setAttribute("aria-hidden", "false");
      document.body.classList.add("has-lightbox-open");
      lightboxImage.src = item.src;
      lightboxImage.alt = item.alt;
      lightboxKicker.textContent = item.kicker;
      lightboxTitle.textContent = item.title;
    };

    const closeLightbox = () => {
      if (!lightbox) {
        return;
      }

      lightbox.hidden = true;
      lightbox.setAttribute("aria-hidden", "true");
      document.body.classList.remove("has-lightbox-open");
    };

    const animatePanels = () => {
      if (prefersReducedMotion()) {
        return;
      }

      [filmstrip].forEach((element) => {
        if (!element || typeof element.animate !== "function") {
          return;
        }

        element.animate(
          [
            { opacity: 0, transform: "translateY(10px)" },
            { opacity: 1, transform: "translateY(0)" },
          ],
          {
            duration: 260,
            easing: "cubic-bezier(0.2, 0.65, 0.2, 1)",
          }
        );
      });
    };

    const setActiveGalleryItem = (route, index = 0) => {
      const galleryItems = Array.isArray(route.gallery) ? route.gallery : [];

      if (!galleryItems.length) {
        return;
      }

      const boundedIndex = clamp(index, 0, galleryItems.length - 1);
      const item = galleryItems[boundedIndex];

      if (!item) {
        return;
      }

      activeGalleryRoute = route;
      activeGalleryIndex = boundedIndex;
      stageFrame.style.setProperty("--photo-position", item.position || "center center");
      setFrameAccent(stageFrame, route.style, item.accent);
      stageImage.src = item.src;
      stageImage.alt = item.alt;
      stageKicker.textContent = item.kicker;
      stageTitle.textContent = item.title;
      refreshVisualImage(stageImage);

      if (lightbox && !lightbox.hidden && lightboxImage && lightboxKicker && lightboxTitle) {
        lightboxImage.src = item.src;
        lightboxImage.alt = item.alt;
        lightboxKicker.textContent = item.kicker;
        lightboxTitle.textContent = item.title;
      }

      storyGallery.querySelectorAll(".journey-thumb").forEach((thumb, thumbIndex) => {
        const isActive = thumbIndex === boundedIndex;
        thumb.classList.toggle("is-active", isActive);
        thumb.setAttribute("aria-selected", String(isActive));
      });
    };

    const renderGallery = (route) => {
      const galleryItems = Array.isArray(route.gallery) ? route.gallery : [];

      if (!galleryItems.length) {
        storyGallery.replaceChildren();
        return;
      }

      storyGallery.replaceChildren();
      activeGalleryRoute = route;

      galleryItems.forEach((item, index) => {
        const thumb = document.createElement("button");
        thumb.type = "button";
        thumb.className = "journey-thumb";
        thumb.setAttribute("aria-label", `${route.title}: ${item.kicker}`);
        thumb.setAttribute("aria-selected", "false");

        const thumbImage = document.createElement("img");
        thumbImage.className = "journey-thumb-image";
        thumbImage.src = getThumbSrc(item.src);
        thumbImage.alt = item.alt;
        thumbImage.loading = "lazy";
        thumbImage.decoding = "async";

        const thumbText = document.createElement("span");
        thumbText.className = "journey-thumb-label";
        thumbText.textContent = item.kicker;

        thumb.append(thumbImage, thumbText);
        thumb.addEventListener("click", () => setActiveGalleryItem(route, index));
        storyGallery.append(thumb);
      });

      setActiveGalleryItem(route, 0);
    };

    const renderSchedule = (key, { animate = false } = {}) => {
      const schedule = yearTripSchedule[key];

      if (!schedule) {
        return;
      }

      const route = schedule.route;
      const routeIndex = yearTripOrder.indexOf(key);

      monthLabel.textContent = `${schedule.month} · ${schedule.label}`;
      month.textContent = schedule.month;
      title.textContent = route.title;
      summary.textContent = route.summary;
      region.textContent = schedule.region;
      format.textContent = schedule.format;
      status.textContent = schedule.status;
      note.textContent = schedule.note;
      visualLabel.textContent = route.visual;
      routeCounter.textContent = `Window ${String(routeIndex + 1).padStart(2, "0")} / ${String(yearTripOrder.length).padStart(2, "0")}`;
      routePill.textContent = schedule.label;
      highlights.innerHTML = route.highlights.map((item) => `<li>${item}</li>`).join("");

      if (galleryTitle) {
        galleryTitle.textContent = route.storyTitle || `${schedule.month} field frames`;
      }

      if (gallerySummary) {
        gallerySummary.textContent =
          route.storySummary || "Click through the selected chapter to see how the day opens up on the ground.";
      }

      if (routeCta) {
        routeCta.textContent = `Ask about ${route.title}`;
        setWhatsAppHref(
          routeCta,
          buildInquiryMessage({
            routeTitle: `${schedule.month} · ${route.title}`,
            notes: `${schedule.label}. ${route.summary}`,
          })
        );
      }

      document.body.dataset.routeStyle = route.style;
      filmstrip.dataset.kind = schedule.kind;
      setActiveStops(key);
      renderGallery(route);

      if (animate) {
        animatePanels();
      }
    };

    const revealStops = () => {
      if (prefersReducedMotion() || !("IntersectionObserver" in window)) {
        stops.forEach((stop) => stop.classList.add("is-visible"));
        return;
      }

      const observer = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (!entry.isIntersecting) {
              return;
            }

            const stop = entry.target;
            stop.classList.add("is-visible");

            const dot = stop.querySelector(".journey-stop-dot");

            if (dot && typeof dot.animate === "function") {
              dot.animate(
                [
                  { transform: "translate(-50%, 0) scale(0.9)", opacity: 0.7 },
                  { transform: "translate(-50%, 0) scale(1.18)", opacity: 1 },
                  { transform: "translate(-50%, 0) scale(1)", opacity: 1 },
                ],
                {
                  duration: 700,
                  easing: "cubic-bezier(0.22, 1, 0.36, 1)",
                }
              );
            }

            observer.unobserve(stop);
          });
        },
        { threshold: 0.3 }
      );

      stops.forEach((stop) => observer.observe(stop));
    };

    const params = new URLSearchParams(window.location.search);
    const requestedSlot = params.get("slot");
    const initialKey = Object.prototype.hasOwnProperty.call(yearTripSchedule, requestedSlot) ? requestedSlot : "may";

    renderSchedule(initialKey);
    setYearProgress();
    setNextStop();
    revealStops();

    stops.forEach((stop) => {
      stop.addEventListener("click", () => {
        const key = stop.dataset.yearStop;

        if (!key || !Object.prototype.hasOwnProperty.call(yearTripSchedule, key)) {
          return;
        }

        renderSchedule(key, { animate: true });

        const nextUrl = new URL(window.location.href);
        nextUrl.searchParams.set("slot", key);
        window.history.replaceState(null, "", nextUrl);
      });
    });

    stageOpen?.addEventListener("click", openLightbox);
    stageFrame?.addEventListener("click", openLightbox);
    lightboxClose?.addEventListener("click", closeLightbox);
    lightboxBackdrop?.addEventListener("click", closeLightbox);
    document.addEventListener("keydown", (event) => {
      if (event.key === "Escape" && lightbox && !lightbox.hidden) {
        closeLightbox();
      }
    });
  };
  const setupContactForm = () => {
    const form = document.getElementById("contact-form");
    const response = document.getElementById("form-response");
    const usesPlaceholderEndpoint = !FORM_ENDPOINT || FORM_ENDPOINT.includes("YOUR_ID");

    if (!form || !response) {
      return;
    }

    form.addEventListener("submit", async (event) => {
      event.preventDefault();

      const btn = form.querySelector('button[type="submit"]');

      if (!btn) {
        return;
      }

      btn.disabled = true;
      btn.textContent = "Sending...";
      response.textContent = "";
      response.removeAttribute("style");

      try {
        if (usesPlaceholderEndpoint) {
          const payload = Object.fromEntries(new FormData(form));
          const fallbackLink = buildWhatsAppLink(
            buildInquiryMessage({
              name: payload.name,
              email: payload.email,
              interest: payload.interest,
              notes: payload.message,
            })
          );

          window.open(fallbackLink, "_blank", "noopener");
          response.innerHTML = `WhatsApp opened with your trip details. <a href="${fallbackLink}" target="_blank" rel="noreferrer">Open it again</a>`;
          response.style.color = "var(--canopy)";
          return;
        }

        const res = await fetch(FORM_ENDPOINT, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
          },
          body: JSON.stringify(Object.fromEntries(new FormData(form))),
        });

        if (!res.ok) {
          throw new Error("Failed");
        }

        response.textContent = "Sent. We will be in touch soon.";
        response.style.color = "var(--canopy)";
        form.reset();
      } catch (error) {
        const fallbackLink = buildWhatsAppLink(
          buildInquiryMessage({
            name: form.elements.name?.value,
            email: form.elements.email?.value,
            interest: form.elements.interest?.value,
            notes: form.elements.message?.value,
          })
        );

        response.innerHTML = `Something went wrong. <a href="${fallbackLink}" target="_blank" rel="noreferrer">Try WhatsApp</a>`;
        response.style.color = "var(--clay)";

        if (typeof form.animate === "function") {
          form.animate(
            [
              { transform: "translateX(0)" },
              { transform: "translateX(-6px)" },
              { transform: "translateX(6px)" },
              { transform: "translateX(-4px)" },
              { transform: "translateX(4px)" },
              { transform: "translateX(0)" },
            ],
            {
              duration: 360,
              easing: "ease",
            }
          );
        }
      } finally {
        btn.disabled = false;
        btn.textContent = "Send inquiry";
      }
    });
  };

  const setupLazyImages = () => {
    document.querySelectorAll('img[loading="lazy"]').forEach((image) => {
      refreshVisualImage(image);
    });
  };

  const setCurrentYear = () => {
    document
      .querySelectorAll('[data-year]')
      .forEach(el => el.textContent = new Date().getFullYear());
  };

  const setupSmoothAnchorScroll = () => {
    document.addEventListener("click", (event) => {
      const link = event.target.closest('a[href^="#"]');

      if (!link || isModifiedClick(event)) {
        return;
      }

      const hash = link.getAttribute("href");

      if (!hash || hash === "#") {
        return;
      }

      const target = findHashTarget(hash);

      if (!target) {
        return;
      }

      event.preventDefault();
      scrollToHash(hash, "smooth");

      if (window.location.hash !== hash) {
        window.history.pushState(null, "", hash);
      }
    });

    if (window.location.hash) {
      window.setTimeout(() => {
        scrollToHash(window.location.hash, "auto");
      }, 40);
    }
  };

  ensureIconSprite();
  const pageLoader = document.getElementById("page-loader");
  setupWhatsAppLinks();
  setupMobileMenu();
  setupJourneyAtlas();
  setupContactForm();
  setCurrentYear();
  highlightCurrentPage();
  setupRevealAnimations();
  setupHeroParallax();
  setupAtlasTilt();
  setupLazyImages();
  setupSmoothAnchorScroll();

  if (pageLoader) {
    window.requestAnimationFrame(() => {
      pageLoader.classList.add("is-hidden");
    });
  }
});



