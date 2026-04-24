const modules = [
  {
    id: 'overview',
    title: 'Overview',
    icon: '🏛️',
    badgeIcon: null,
    badgeLabel: null,
    explanation: 'Welcome to the Election Process Education Assistant! This interactive guide will walk you through every stage of Indian democratic elections — from voter registration to the final declaration of results by the Election Commission of India (ECI). Complete each module, pass the quizzes, and earn badges along the way.',
    timelineSteps: [
      { title: 'Register as a Voter', description: 'Learn how Indian citizens enroll in the electoral roll.' },
      { title: 'Know The Law', description: 'Understand the Indian Constitution and election laws that protect democracy.' },
      { title: 'Campaign Season', description: 'See how parties and candidates reach voters across India.' },
      { title: 'Cast Your Vote', description: 'Experience the EVM-based voting process used in India.' },
      { title: 'Count & Declare', description: 'Learn how the Election Commission counts votes and declares results.' }
    ],
    quiz: []
  },
  {
    id: 'registration',
    title: 'Voter Registration',
    icon: '📝',
    badgeIcon: '📝',
    badgeLabel: 'Registered Voter',
    explanation: 'In India, every citizen who is 18 years or older on the qualifying date is eligible to vote. The Election Commission of India (ECI) maintains the electoral roll. You must register yourself using Form 6 — either online through the National Voters\' Service Portal (NVSP) or offline at your local Electoral Registration Office (ERO).',
    timelineSteps: [
      { title: 'Check Eligibility', description: 'You must be an Indian citizen, at least 18 years of age on the qualifying date (1st January of the year), and a resident of the constituency where you wish to vote.' },
      { title: 'Gather Documents', description: 'Collect your Aadhaar Card, PAN Card, or any government-issued photo ID. You will also need proof of address such as a ration card, utility bill, or passport.' },
      { title: 'Fill Form 6', description: 'Submit Form 6 (Application for Inclusion of Name in the Electoral Roll) online via the NVSP portal (nvsp.in) or at your nearest ERO/BLO office.' },
      { title: 'Verification by BLO', description: 'A Booth Level Officer (BLO) will visit your address to verify your identity and residence before adding your name to the electoral roll.' },
      { title: 'Receive Voter ID (EPIC)', description: 'Once approved, you receive your Electors Photo Identity Card (EPIC) — commonly known as the Voter ID card — which you present at the polling booth.' }
    ],
    quiz: [
      {
        question: 'What is the minimum voting age in India?',
        options: ['16 years', '18 years', '21 years', '25 years'],
        correctIndex: 1
      },
      {
        question: 'Which form is used to register as a new voter in India?',
        options: ['Form 1', 'Form 6', 'Form 8', 'Form 11'],
        correctIndex: 1
      },
      {
        question: 'What is EPIC in the context of Indian elections?',
        options: ['Electronic Polling Integration Card', 'Electors Photo Identity Card', 'Election Process Information Certificate', 'Electoral Participation ID Card'],
        correctIndex: 1
      }
    ]
  },
  {
    id: 'laws',
    title: 'Election Laws',
    icon: '⚖️',
    badgeIcon: '⚖️',
    badgeLabel: 'Legal Scholar',
    explanation: 'Indian elections are governed by a robust legal framework rooted in the Constitution of India. The Election Commission of India (ECI), established under Article 324, is an autonomous constitutional body responsible for conducting free and fair elections across the country. Key laws include the Representation of the People Act, 1950 and 1951, and the Model Code of Conduct.',
    timelineSteps: [
      { title: 'Constitutional Foundation', description: 'Article 324-329 of the Indian Constitution establish the Election Commission and guarantee the right to vote. Article 326 provides for universal adult suffrage — every citizen 18 years and above has the right to vote.' },
      { title: 'Representation of the People Act, 1950', description: 'This Act deals with the preparation of electoral rolls, allocation of seats, and delimitation of constituencies across India.' },
      { title: 'Representation of the People Act, 1951', description: 'This Act covers the conduct of elections, qualifications and disqualifications of candidates, corrupt practices, election petitions, and offences related to elections.' },
      { title: 'Model Code of Conduct (MCC)', description: 'A set of guidelines issued by the ECI for political parties and candidates during elections. It covers general conduct, meetings & processions, polling day behavior, and use of government resources.' },
      { title: 'Anti-Defection Law (10th Schedule)', description: 'Added by the 52nd Constitutional Amendment in 1985, this law prevents elected MLAs/MPs from switching parties after being elected, strengthening party discipline and democratic stability.' }
    ],
    quiz: [
      {
        question: 'Which Article of the Indian Constitution establishes the Election Commission?',
        options: ['Article 14', 'Article 21', 'Article 324', 'Article 370'],
        correctIndex: 2
      },
      {
        question: 'What does the Model Code of Conduct (MCC) regulate?',
        options: ['Taxation during elections', 'Behavior of parties and candidates during election period', 'Salaries of election officials', 'Foreign policy during elections'],
        correctIndex: 1
      },
      {
        question: 'Which Act deals with the conduct of elections and corrupt practices in India?',
        options: ['Right to Information Act, 2005', 'Representation of the People Act, 1951', 'Indian Penal Code, 1860', 'Companies Act, 2013'],
        correctIndex: 1
      }
    ]
  },
  {
    id: 'campaigns',
    title: 'Campaigns & Debates',
    icon: '📢',
    badgeIcon: '📢',
    badgeLabel: 'Campaign Analyst',
    explanation: 'Indian election campaigns are among the largest democratic exercises in the world. Political parties and candidates use a mix of traditional rallies, roadshows, door-to-door canvassing, social media, and television debates to reach over 96 crore (960 million) eligible voters. The Election Commission enforces strict spending limits and the Model Code of Conduct to ensure a level playing field.',
    timelineSteps: [
      { title: 'Party Ticket & Nominations', description: 'Political parties select candidates and distribute party tickets (symbols). Candidates file their nomination papers with the Returning Officer, along with a security deposit of ₹25,000 (Lok Sabha) or ₹10,000 (State Assembly).' },
      { title: 'Campaign Period', description: 'Campaigning typically runs for 2-3 weeks. Parties hold large public rallies (sabhas), roadshows (yatras), and nukkad sabhas (street-corner meetings) to connect with voters.' },
      { title: 'Media & Social Media', description: 'Parties extensively use TV, newspapers, radio, and social media platforms like X (Twitter), Facebook, and WhatsApp. Paid political advertisements on TV must carry disclaimer tags as per ECI guidelines.' },
      { title: 'Election Expenditure Limits', description: 'The ECI sets spending limits — ₹95 lakh for Lok Sabha and ₹40 lakh for State Assembly elections. Candidates must maintain detailed accounts and file expenditure statements within 30 days of results.' },
      { title: 'Campaign Silence Period', description: 'Campaigning must stop 48 hours before polling (known as the "silence period"). No party or candidate can campaign, distribute materials, or hold meetings during this time to let voters decide independently.' }
    ],
    quiz: [
      {
        question: 'How long before polling must campaigning stop in India?',
        options: ['12 hours', '24 hours', '48 hours', '72 hours'],
        correctIndex: 2
      },
      {
        question: 'What is the current election expenditure limit for a Lok Sabha constituency?',
        options: ['₹25 lakh', '₹50 lakh', '₹70 lakh', '₹95 lakh'],
        correctIndex: 3
      }
    ]
  },
  {
    id: 'voting',
    title: 'Voting Process',
    icon: '🗳️',
    badgeIcon: '🗳️',
    badgeLabel: 'Civic Duty',
    explanation: 'India uses Electronic Voting Machines (EVMs) and Voter Verifiable Paper Audit Trails (VVPATs) to conduct elections. The process is managed by the Election Commission of India with over 10 million polling officials deployed across lakhs of polling stations. Every registered voter gets a chance to cast their vote secretly and securely.',
    timelineSteps: [
      { title: 'Locate Your Polling Booth', description: 'Check your polling station using the Voter Helpline App, NVSP portal, or by sending an SMS. Your EPIC (Voter ID) card mentions your booth details.' },
      { title: 'Verify Identity at the Booth', description: 'Present your EPIC card or any of the 12 approved photo ID documents (Aadhaar, Passport, PAN Card, Driving License, etc.) at the polling booth. Your finger is checked for existing ink marks.' },
      { title: 'Indelible Ink Application', description: 'After identity verification, indelible ink is applied to the index finger of your left hand. This ink cannot be removed for 48-72 hours and prevents duplicate voting.' },
      { title: 'Vote on the EVM', description: 'Enter the voting compartment privately. Press the button next to your chosen candidate\'s name and party symbol on the Balloting Unit of the EVM. A beep confirms your vote.' },
      { title: 'VVPAT Verification', description: 'After pressing the EVM button, the VVPAT machine displays a printed slip showing the candidate\'s name and symbol for 7 seconds, allowing you to verify your vote before it drops into a sealed box.' }
    ],
    quiz: [
      {
        question: 'What does EVM stand for in Indian elections?',
        options: ['Electronic Vote Manager', 'Electronic Voting Machine', 'Electoral Verification Module', 'Election Validity Mechanism'],
        correctIndex: 1
      },
      {
        question: 'What is the purpose of VVPAT in the voting process?',
        options: ['To speed up counting', 'To allow voters to verify their vote on a paper slip', 'To store voter photos', 'To connect EVMs to the internet'],
        correctIndex: 1
      },
      {
        question: 'Why is indelible ink applied to a voter\'s finger?',
        options: ['For decoration', 'To prevent duplicate voting', 'To track voters via GPS', 'It is optional and not required'],
        correctIndex: 1
      }
    ]
  },
  {
    id: 'results',
    title: 'Counting & Results',
    icon: '🏆',
    badgeIcon: '🏆',
    badgeLabel: 'Election Expert',
    explanation: 'After polling is completed across all phases, the Election Commission of India sets a counting day. EVMs are stored in strong rooms under CCTV surveillance and armed security. On counting day, votes are tallied round by round in each constituency under the supervision of the Returning Officer, with candidates\' agents present as observers.',
    timelineSteps: [
      { title: 'EVM Strong Room Storage', description: 'After polling, all EVMs are sealed and stored in designated strong rooms under 24/7 CCTV surveillance, with security personnel and representatives of candidates guarding them until counting day.' },
      { title: 'Counting Day Process', description: 'On counting day, postal ballots are counted first. Then EVMs are opened round by round (each round = a set of 14 EVMs). Results are announced table-by-table by the Returning Officer.' },
      { title: 'VVPAT Verification (5 Booths)', description: 'As per Supreme Court orders, VVPAT slips from 5 randomly selected polling stations in each constituency are matched with EVM counts to ensure accuracy and voter confidence.' },
      { title: 'Declaration of Results', description: 'Once all rounds are completed, the Returning Officer declares the winning candidate. Results are simultaneously updated on the ECI website (results.eci.gov.in) in real-time.' },
      { title: 'Formation of Government', description: 'The party or coalition with a majority of seats (272 out of 543 in Lok Sabha) is invited by the President/Governor to form the government. The leader is sworn in as Prime Minister/Chief Minister.' }
    ],
    quiz: [
      {
        question: 'How many Lok Sabha seats are needed for a majority to form the government?',
        options: ['200', '250', '272', '300'],
        correctIndex: 2
      },
      {
        question: 'What is counted first on counting day in Indian elections?',
        options: ['EVM votes', 'Postal ballots', 'VVPAT slips', 'NOTA votes'],
        correctIndex: 1
      },
      {
        question: 'How many VVPAT slips are verified per constituency as per Supreme Court orders?',
        options: ['1 booth', '3 booths', '5 booths', '10 booths'],
        correctIndex: 2
      }
    ]
  }
];

export default modules;
