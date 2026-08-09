import type { Locale } from '../../i18n/config';

export const duckyArenaRepository = 'https://github.com/Martret92/DuckyArena';

const shared = {
  stack: [
    'React',
    'Vite',
    'Node.js',
    'Express',
    'Socket.IO',
    'PostgreSQL',
    'Docker',
    'GitHub Actions',
  ],
  images: {
    characterSelect: {
      src: '/images/projects/duckyarena/01-character-select-redacted.jpg',
      width: 1425,
      height: 891,
    },
    laneSelection: {
      src: '/images/projects/duckyarena/02-lane-selection-redacted.jpg',
      width: 1425,
      height: 891,
    },
    matchupReveal: {
      src: '/images/projects/duckyarena/03-matchup-reveal-redacted.jpg',
      width: 1425,
      height: 891,
    },
    combat: {
      src: '/images/projects/duckyarena/04-combat-redacted.jpg',
      responsiveSrc: '/images/projects/duckyarena/04-combat-redacted-1000.jpg',
      width: 1425,
      height: 1484,
    },
    result: {
      src: '/images/projects/duckyarena/05-result-redacted.jpg',
      width: 1425,
      height: 1509,
    },
  },
} as const;

const localized = {
  en: {
    metadata: {
      title: 'DuckyArena — Realtime multiplayer case study',
      description:
        'A collaborative full stack case study about hidden three-lane strategy, server-authoritative realtime combat and durable PostgreSQL results.',
    },
    home: {
      eyebrow: 'Selected project · Collaborative work',
      title: 'DuckyArena',
      summary:
        'DuckyArena combines private-room 3v3 play, hidden lane deployment and realtime technical-question duels. A server-authoritative Node.js backend resolves combat, while React presents the complete flow from Duckie selection to persistent match results.',
      stackLabel: 'Project stack',
      cta: 'Explore case study',
    },
    hero: {
      eyebrow: 'Collaborative full stack project · Realtime game systems',
      heading: 'DuckyArena',
      positioning:
        'Realtime 3v3 Duckie battles where hidden lane strategy and technical answers decide a server-authoritative best-of-three match.',
      introduction:
        'Six authenticated players join a private room, form BLUE and RED teams, select distinct Duckies, secretly claim three lanes and reveal three simultaneous 1v1 matchups. Correctness, response timing and Signature Abilities feed a deterministic combat engine; the first team to win two lanes takes the match.',
      backHome: 'Back to Home',
      stackLabel: 'Stack',
    },
    overview: {
      heading: 'Overview',
      paragraphs: [
        'DuckyArena is a competitive realtime 3v3 web game built from a collaborative academic foundation and later taken through a structured professionalization pass.',
        'The current slice connects a snapshot-driven React interface to Express, Socket.IO and PostgreSQL. It covers the complete six-player private-room flow from Duckie selection and hidden TOP, MID and BOTTOM deployment through combat, persisted results and profile statistics.',
      ],
    },
    challenge: {
      heading: 'Challenge and solution',
      challenge:
        'The academic base contained useful full stack pieces, but they did not yet communicate one dependable game experience. The challenge was to connect authenticated identity, hidden pregame decisions, three concurrent combats and durable results without allowing clients to become gameplay authorities.',
      solution:
        'The professionalization pass established a server-authoritative match lifecycle, separated persistent REST concerns from live Socket.IO gameplay and projected only player-authorized information into each snapshot. A focused presentation pass then gave the flow a coherent farm-arena identity without changing game rules.',
    },
    gameplay: {
      heading: 'Gameplay flow',
      copy: 'BLUE and RED each contain three authenticated players. Every team assigns exactly one player to TOP, MID and BOTTOM; rival assignments remain hidden until all lanes are locked and the server reveals the three independent duels. The first team to win two lanes wins the match, and an unresolved third lane becomes CANCELLED.',
      flowLabel: 'DuckyArena gameplay flow',
      steps: [
        'Authenticate',
        'Create or join a private room',
        'Assemble six players',
        'Choose a Duckie',
        'Lock a lane in secret',
        'Reveal three matchups',
        'Resolve realtime combat',
        'Persist result and profile statistics',
      ],
    },
    architecture: {
      heading: 'Server authority and realtime architecture',
      copy: 'React renders catalog, room, match and profile projections and sends player intentions. Express handles durable identity, profile and catalog concerns; Socket.IO manages the authenticated live match lifecycle. The backend remains the authority for every gameplay outcome.',
      flowLabel: 'DuckyArena system boundaries',
      layers: [
        {
          name: 'React + Vite',
          detail: 'Renders per-player snapshots and submits player intentions.',
        },
        {
          name: 'Express REST',
          detail: 'Handles durable identity, profile and catalog concerns.',
        },
        {
          name: 'Socket.IO',
          detail: 'Coordinates authenticated rooms, pregame and live combat.',
        },
        {
          name: 'Domain modules',
          detail: 'Resolve deterministic combat and authoritative match state.',
        },
        {
          name: 'PostgreSQL',
          detail:
            'Persists identity, completed results and profile statistics.',
        },
      ],
      signals: [
        'Authenticated player identity is independent from socket IDs.',
        'Per-player projections preserve rival information before reveal.',
        'Three isolated lane combats resolve into one best-of-three match.',
        'Active rooms, timers and combat live in one Node.js process.',
      ],
    },
    contribution: {
      heading: 'My contribution · Professionalization',
      introduction:
        'Built on a collaborative academic foundation, I took the current implementation through a structured professionalization pass spanning:',
      items: [
        {
          heading: 'Realtime backend and domain',
          copy: 'Stabilized authenticated Socket.IO identity, private-room and pregame lifecycles, hidden-information projections, three-lane orchestration and deterministic server-authoritative combat.',
        },
        {
          heading: 'Data and persistence',
          copy: 'Integrated bcrypt/JWT identity with PostgreSQL and transactional, idempotent storage for one match and its six participants, plus authenticated aggregate profile statistics.',
        },
        {
          heading: 'Frontend and gameplay integration',
          copy: 'Connected the React flow from authentication and room entry through selection, reveal, combat, result and profile, using server snapshots as the source of truth.',
        },
        {
          heading: 'Quality and reproducibility',
          copy: 'Consolidated regression coverage, GitHub Actions, PostgreSQL initialization and migration checks, Dockerized services, health checks and a stack smoke test.',
        },
        {
          heading: 'Visual and game feel',
          copy: 'Defined the visual system and presentation layer for four Duckies, hidden lane strategy, matchup reveal, duel combat and match results while keeping gameplay and backend rules frozen.',
        },
      ],
    },
    decisions: {
      heading: 'Engineering decisions',
      items: [
        {
          heading: 'Server authority',
          decision:
            'Clients submit intentions; the backend validates and resolves outcomes.',
          tradeoff:
            'The backend owns more lifecycle complexity and must remain available during a match.',
        },
        {
          heading: 'REST and Socket.IO split',
          decision:
            'REST serves durable concerns; Socket.IO serves the live match.',
          tradeoff:
            'Authentication and errors must remain aligned across both boundaries.',
        },
        {
          heading: 'Player identity beyond sockets',
          decision:
            'Sockets bind to authenticated profiles rather than becoming player identities.',
          tradeoff:
            'Membership and reconnection require explicit identity reconciliation.',
        },
        {
          heading: 'Per-player projections',
          decision: 'Snapshots contain only information each player may know.',
          tradeoff:
            'Projection code and secrecy regression tests add complexity.',
        },
        {
          heading: 'Deterministic combat',
          decision:
            'Canonical inputs and explicit rules resolve answers, timing, abilities and sudden death.',
          tradeoff:
            'Visual feedback must follow authoritative snapshots rather than predict effects.',
        },
        {
          heading: 'Live memory, durable results',
          decision:
            'Active combat remains in one process; completed results persist in PostgreSQL.',
          tradeoff:
            'A process restart loses active matches and the live state cannot scale horizontally.',
        },
      ],
      decisionLabel: 'Decision',
      tradeoffLabel: 'Trade-off',
    },
    visual: {
      heading: 'Visual and game-feel professionalization',
      paragraphs: [
        'The functional product initially communicated its quiz mechanics more strongly than its competitive-game structure. The presentation pass introduced four coherent Duckie identities, a fighting-game-inspired character select, an illustrated three-lane farm arena, authoritative matchup reveal, duel-focused combat HUD and a conclusive best-of-three result screen.',
        'Assets describe the world. React describes current state. Backend decides truth. Visual feedback amplifies authoritative events but never changes damage, timing, cooldowns, secrecy or match resolution.',
      ],
    },
    quality: {
      heading: 'Quality and evidence',
      copy: 'The finished slice is supported by automated backend, frontend, database and delivery checks plus one manually verified real six-player flow.',
      items: [
        '64 backend tests covering authentication, pregame, secrecy, combat, abilities, three-lane resolution, reconnect, persistence and statistics.',
        'Backend lint, frontend lint and production build checks.',
        'GitHub Actions jobs for backend, frontend, PostgreSQL integration and Docker reproducibility.',
        'Clean PostgreSQL initialization and explicit historical migration verification.',
        'Docker Compose health checks and an automated stack smoke test.',
        'Five captures from one authoritative match verified with six real authenticated players.',
        'Browser E2E is not automated; the full visual flow was verified through targeted real-client and harness checks.',
      ],
    },
    outcomes: {
      heading: 'Outcomes and limits',
      outcomesLabel: 'Outcomes',
      outcomes: [
        'Connected the academic components into one coherent end-to-end product slice.',
        'Established explicit authority and secrecy boundaries for realtime multiplayer interactions.',
        'Made completed results durable and profile statistics queryable after Node.js restarts.',
        'Turned local setup and critical validation into reproducible Docker and CI workflows.',
      ],
      limitsLabel: 'Architectural limits',
      limits: [
        'Matches require exactly six players in private rooms.',
        'Active live state exists in one Node.js process.',
        'A process restart loses active matches.',
        'The realtime layer does not support horizontal scaling.',
        'No public deployment is available.',
      ],
    },
    screenshots: {
      characterSelect: {
        caption:
          'Four role-defined Duckies and their Signature Abilities presented within the live BLUE/RED team selection state.',
        alt: 'DuckyArena character selection showing four Duckies, roles, abilities and team rosters.',
      },
      laneSelection: {
        caption:
          'BLUE deploys across Orchard, Farmyard and Pond while rival assignments remain hidden until the server reveal.',
        alt: 'DuckyArena farm arena with three selectable lanes, BLUE tokens and hidden RED deployment.',
      },
      matchupReveal: {
        caption:
          "The authoritative reveal exposes all three BLUE vs RED lane matchups and emphasizes the current player's duel.",
        alt: 'DuckyArena matchup reveal showing six players paired across Orchard, Farmyard and Pond lanes.',
      },
      combat: {
        caption:
          'A realtime technical-question duel with server-resolved HP, Signature Ability state and the global three-lane score.',
        alt: 'DuckyArena combat screen with two Duckies, HP bars, technical question, four answers, ability and lane score.',
      },
      result: {
        caption:
          'The match closes with a clear 2-of-3 result, per-lane outcomes, cancelled-lane semantics and persisted profile evidence.',
        alt: 'DuckyArena victory result showing final BLUE and RED score, three lane outcomes and saved match status.',
      },
    },
    repositoryCta: 'View repository',
  },
  es: {
    metadata: {
      title: 'DuckyArena — Caso de estudio multijugador realtime',
      description:
        'Caso de estudio full stack colaborativo sobre estrategia oculta de tres líneas, combate realtime autoritativo y resultados persistentes en PostgreSQL.',
    },
    home: {
      eyebrow: 'Proyecto seleccionado · Trabajo colaborativo',
      title: 'DuckyArena',
      summary:
        'DuckyArena combina partidas 3v3 en salas privadas, despliegue oculto por líneas y duelos en tiempo real basados en preguntas técnicas. Un backend autoritativo en Node.js resuelve el combate, mientras React presenta el flujo completo desde la selección de Duckie hasta los resultados persistentes.',
      stackLabel: 'Stack del proyecto',
      cta: 'Explorar caso de estudio',
    },
    hero: {
      eyebrow: 'Proyecto full stack colaborativo · Sistemas de juego realtime',
      heading: 'DuckyArena',
      positioning:
        'Batallas 3v3 de Duckies en tiempo real donde la estrategia oculta por líneas y las respuestas técnicas deciden una partida autoritativa al mejor de tres.',
      introduction:
        'Seis jugadores autenticados entran en una sala privada, forman los equipos BLUE y RED, eligen Duckies distintos, ocupan en secreto tres líneas y revelan tres enfrentamientos 1v1 simultáneos. La corrección, el tiempo de respuesta y las Signature Abilities alimentan un motor de combate determinista; el primer equipo que gana dos líneas se lleva la partida.',
      backHome: 'Volver al inicio',
      stackLabel: 'Stack',
    },
    overview: {
      heading: 'Resumen',
      paragraphs: [
        'DuckyArena es un juego web competitivo 3v3 en tiempo real construido sobre una base académica colaborativa y llevado posteriormente a través de un proceso estructurado de profesionalización.',
        'El slice actual conecta una interfaz React dirigida por snapshots con Express, Socket.IO y PostgreSQL. Cubre el flujo completo de sala privada para seis jugadores, desde la selección de Duckie y el despliegue oculto en TOP, MID y BOTTOM hasta combate, resultados persistidos y estadísticas de perfil.',
      ],
    },
    challenge: {
      heading: 'Reto y solución',
      challenge:
        'La base académica contenía piezas full stack útiles, pero todavía no comunicaba una experiencia de juego única y fiable. El reto fue conectar identidad autenticada, decisiones pregame ocultas, tres combates concurrentes y resultados duraderos sin convertir al cliente en autoridad de gameplay.',
      solution:
        'La profesionalización estableció un ciclo de partida autoritativo en servidor, separó las responsabilidades persistentes de REST del gameplay en vivo mediante Socket.IO y proyectó en cada snapshot solo la información autorizada para cada jugador. Después, una capa visual enfocada dio coherencia de farm arena al flujo sin cambiar las reglas.',
    },
    gameplay: {
      heading: 'Flujo de juego',
      copy: 'BLUE y RED tienen tres jugadores autenticados cada uno. Cada equipo asigna exactamente un jugador a TOP, MID y BOTTOM; las asignaciones rivales permanecen ocultas hasta que todas las líneas están bloqueadas y el servidor revela los tres duelos independientes. El primer equipo que gana dos líneas vence, y una tercera línea sin resolver queda CANCELLED.',
      flowLabel: 'Flujo de juego de DuckyArena',
      steps: [
        'Autenticarse',
        'Crear o entrar en una sala privada',
        'Reunir seis jugadores',
        'Elegir un Duckie',
        'Bloquear una línea en secreto',
        'Revelar tres enfrentamientos',
        'Resolver el combate realtime',
        'Persistir resultado y estadísticas de perfil',
      ],
    },
    architecture: {
      heading: 'Autoridad del servidor y arquitectura realtime',
      copy: 'React renderiza proyecciones de catálogo, sala, partida y perfil y envía intenciones del jugador. Express atiende identidad, perfil y catálogo duraderos; Socket.IO gestiona el ciclo autenticado de la partida en vivo. El backend mantiene la autoridad de todos los resultados de gameplay.',
      flowLabel: 'Límites del sistema DuckyArena',
      layers: [
        {
          name: 'React + Vite',
          detail: 'Renderiza snapshots por jugador y envía intenciones.',
        },
        {
          name: 'Express REST',
          detail: 'Atiende identidad, perfil y catálogo duraderos.',
        },
        {
          name: 'Socket.IO',
          detail: 'Coordina salas autenticadas, pregame y combate en vivo.',
        },
        {
          name: 'Módulos de dominio',
          detail: 'Resuelven combate determinista y estado autoritativo.',
        },
        {
          name: 'PostgreSQL',
          detail: 'Persiste identidad, resultados terminados y estadísticas.',
        },
      ],
      signals: [
        'La identidad autenticada del jugador es independiente de los socket IDs.',
        'Las proyecciones por jugador preservan información rival antes del reveal.',
        'Tres combates aislados se resuelven en una partida al mejor de tres.',
        'Salas activas, temporizadores y combate viven en un proceso Node.js.',
      ],
    },
    contribution: {
      heading: 'Mi contribución · Profesionalización',
      introduction:
        'Partiendo de una base académica colaborativa, llevé la implementación actual a través de un proceso estructurado de profesionalización que abarcó:',
      items: [
        {
          heading: 'Backend realtime y dominio',
          copy: 'Estabilicé identidad autenticada en Socket.IO, ciclos de sala privada y pregame, proyecciones de información oculta, orquestación de tres líneas y combate determinista autoritativo en servidor.',
        },
        {
          heading: 'Datos y persistencia',
          copy: 'Integré identidad bcrypt/JWT con PostgreSQL y persistencia transaccional e idempotente para una partida y sus seis participantes, además de estadísticas agregadas autenticadas por perfil.',
        },
        {
          heading: 'Frontend e integración de gameplay',
          copy: 'Conecté el flujo React desde autenticación y sala hasta selección, reveal, combate, resultado y perfil, usando snapshots del servidor como fuente de verdad.',
        },
        {
          heading: 'Calidad y reproducibilidad',
          copy: 'Consolidé cobertura de regresión, GitHub Actions, inicialización y migraciones PostgreSQL, servicios Dockerizados, health checks y un smoke test del stack.',
        },
        {
          heading: 'Visual y game feel',
          copy: 'Definí el sistema visual y la capa de presentación para cuatro Duckies, estrategia oculta, reveal, duelo y resultados manteniendo congeladas las reglas de gameplay y backend.',
        },
      ],
    },
    decisions: {
      heading: 'Decisiones de ingeniería',
      items: [
        {
          heading: 'Autoridad del servidor',
          decision:
            'Los clientes envían intenciones; el backend valida y resuelve resultados.',
          tradeoff:
            'El backend asume más complejidad y debe seguir disponible durante la partida.',
        },
        {
          heading: 'Separación REST y Socket.IO',
          decision:
            'REST sirve datos duraderos; Socket.IO sirve la partida en vivo.',
          tradeoff:
            'Autenticación y errores deben mantenerse alineados en ambos límites.',
        },
        {
          heading: 'Identidad más allá del socket',
          decision:
            'Los sockets se vinculan a perfiles autenticados; no se convierten en jugadores.',
          tradeoff:
            'Membresía y reconexión necesitan reconciliación explícita.',
        },
        {
          heading: 'Proyecciones por jugador',
          decision:
            'Los snapshots contienen solo la información que cada jugador puede conocer.',
          tradeoff:
            'El código de proyección y los tests de secreto añaden complejidad.',
        },
        {
          heading: 'Combate determinista',
          decision:
            'Inputs canónicos y reglas explícitas resuelven respuestas, tiempos, habilidades y muerte súbita.',
          tradeoff:
            'El feedback visual debe seguir snapshots autoritativos, no predecir efectos.',
        },
        {
          heading: 'Estado vivo y resultados duraderos',
          decision:
            'El combate activo vive en un proceso; los resultados terminados persisten en PostgreSQL.',
          tradeoff:
            'Un reinicio pierde partidas activas y el estado vivo no escala horizontalmente.',
        },
      ],
      decisionLabel: 'Decisión',
      tradeoffLabel: 'Trade-off',
    },
    visual: {
      heading: 'Profesionalización visual y game feel',
      paragraphs: [
        'El producto funcional comunicaba inicialmente su mecánica de preguntas con más fuerza que su estructura competitiva. La presentación incorporó cuatro identidades coherentes de Duckie, Character Select inspirado en juegos de lucha, una farm arena ilustrada con tres líneas, reveal autoritativo, HUD centrado en el duelo y una pantalla final clara al mejor de tres.',
        'Los assets describen el mundo. React describe el estado actual. El backend decide la verdad. El feedback visual amplifica eventos autoritativos, pero nunca cambia daño, tiempos, cooldowns, secreto ni resolución.',
      ],
    },
    quality: {
      heading: 'Calidad y evidencia',
      copy: 'El slice terminado está respaldado por comprobaciones automatizadas de backend, frontend, base de datos y entrega, además de un flujo real de seis jugadores verificado manualmente.',
      items: [
        '64 tests backend que cubren autenticación, pregame, secreto, combate, habilidades, resolución de tres líneas, reconexión, persistencia y estadísticas.',
        'Lint backend, lint frontend y comprobación del build de producción.',
        'Jobs de GitHub Actions para backend, frontend, integración PostgreSQL y reproducibilidad Docker.',
        'Inicialización limpia de PostgreSQL y verificación explícita de migraciones históricas.',
        'Health checks de Docker Compose y smoke test automatizado del stack.',
        'Cinco capturas de una partida autoritativa verificada con seis jugadores reales autenticados.',
        'El E2E de navegador no está automatizado; el flujo visual se verificó mediante comprobaciones dirigidas con cliente real y harness.',
      ],
    },
    outcomes: {
      heading: 'Resultados y límites',
      outcomesLabel: 'Resultados',
      outcomes: [
        'Conecté los componentes académicos en un slice de producto coherente de extremo a extremo.',
        'Establecí límites explícitos de autoridad y secreto para interacciones multijugador realtime.',
        'Hice duraderos los resultados terminados y consultables las estadísticas tras reinicios de Node.js.',
        'Convertí el setup local y las validaciones críticas en flujos reproducibles de Docker y CI.',
      ],
      limitsLabel: 'Límites arquitectónicos',
      limits: [
        'Las partidas requieren exactamente seis jugadores en salas privadas.',
        'El estado vivo activo existe en un único proceso Node.js.',
        'Un reinicio del proceso pierde las partidas activas.',
        'La capa realtime no soporta escalado horizontal.',
        'No hay deployment público disponible.',
      ],
    },
    screenshots: {
      characterSelect: {
        caption:
          'Cuatro Duckies definidos por rol y sus Signature Abilities dentro del estado realtime de selección BLUE/RED.',
        alt: 'Selección de personajes de DuckyArena con cuatro Duckies, roles, habilidades y rosters de equipo.',
      },
      laneSelection: {
        caption:
          'BLUE se despliega entre Orchard, Farmyard y Pond mientras las asignaciones rivales permanecen ocultas hasta el reveal del servidor.',
        alt: 'Farm arena de DuckyArena con tres líneas seleccionables, tokens BLUE y despliegue RED oculto.',
      },
      matchupReveal: {
        caption:
          'El reveal autoritativo muestra los tres enfrentamientos BLUE contra RED y destaca el duelo del jugador actual.',
        alt: 'Reveal de DuckyArena con seis jugadores emparejados en las líneas Orchard, Farmyard y Pond.',
      },
      combat: {
        caption:
          'Un duelo realtime de preguntas técnicas con HP resuelto por servidor, estado de Signature Ability y marcador global de tres líneas.',
        alt: 'Pantalla de combate de DuckyArena con dos Duckies, barras de HP, pregunta técnica, cuatro respuestas, habilidad y marcador de líneas.',
      },
      result: {
        caption:
          'La partida termina con resultado claro al mejor de tres, outcomes por línea, semántica de cancelación y evidencia persistida de perfil.',
        alt: 'Resultado de victoria de DuckyArena con marcador final BLUE y RED, tres outcomes de línea y estado de partida guardada.',
      },
    },
    repositoryCta: 'Ver repositorio',
  },
} as const satisfies Record<Locale, object>;

export function getDuckyArenaContent(locale: Locale) {
  return {
    ...localized[locale],
    ...shared,
    repository: duckyArenaRepository,
  };
}
