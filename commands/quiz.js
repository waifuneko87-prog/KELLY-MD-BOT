 const questions = [
    // 🧠 General Knowledge
    {
        question: 'What is the largest planet in our Solar System?',
        options: ['Earth', 'Saturn', 'Jupiter', 'Neptune'],
        answer: 3,
        explanation: 'Jupiter is the largest planet in our Solar System.'
    },
    {
        question: 'How many continents are there?',
        options: ['5', '6', '7', '8'],
        answer: 3,
        explanation: 'There are seven continents.'
    },
    {
        question: 'What is the capital of France?',
        options: ['Madrid', 'Paris', 'Rome', 'Berlin'],
        answer: 2,
        explanation: 'Paris is the capital of France.'
    },
    {
        question: 'Which language has the most native speakers?',
        options: ['English', 'Spanish', 'Mandarin Chinese', 'Hindi'],
        answer: 3,
        explanation: 'Mandarin Chinese has the largest number of native speakers.'
    },
    {
        question: 'How many days are there in a leap year?',
        options: ['364', '365', '366', '367'],
        answer: 3,
        explanation: 'A leap year has 366 days.'
    },
    {
        question: 'What is the smallest prime number?',
        options: ['0', '1', '2', '3'],
        answer: 3,
        explanation: '2 is the smallest prime number.'
    },
    {
        question: 'How many sides does a hexagon have?',
        options: ['5', '6', '7', '8'],
        answer: 2,
        explanation: 'A hexagon has six sides.'
    },
    {
        question: 'Which country has the largest population?',
        options: ['India', 'United States', 'China', 'Brazil'],
        answer: 1,
        explanation: 'India is currently the most populous country.'
    },
    {
        question: 'What is the currency of Japan?',
        options: ['Won', 'Yuan', 'Yen', 'Ringgit'],
        answer: 3,
        explanation: 'The Japanese currency is the yen.'
    },
    {
        question: 'How many hours are there in one day?',
        options: ['12', '24', '36', '48'],
        answer: 2,
        explanation: 'One day contains 24 hours.'
    },

    // 🔬 Science
    {
        question: 'What gas do humans need to breathe?',
        options: ['Carbon dioxide', 'Oxygen', 'Hydrogen', 'Helium'],
        answer: 2,
        explanation: 'Humans need oxygen for respiration.'
    },
    {
        question: 'What is H2O commonly known as?',
        options: ['Salt', 'Water', 'Oxygen', 'Hydrogen'],
        answer: 2,
        explanation: 'H2O is the chemical formula for water.'
    },
    {
        question: 'What force keeps us on the ground?',
        options: ['Magnetism', 'Friction', 'Gravity', 'Pressure'],
        answer: 3,
        explanation: 'Gravity pulls objects toward Earth.'
    },
    {
        question: 'What is the center of an atom called?',
        options: ['Electron', 'Nucleus', 'Proton', 'Molecule'],
        answer: 2,
        explanation: 'The nucleus is the dense center of an atom.'
    },
    {
        question: 'Which organ pumps blood around the human body?',
        options: ['Liver', 'Lungs', 'Brain', 'Heart'],
        answer: 4,
        explanation: 'The heart pumps blood throughout the body.'
    },
    {
        question: 'What is the boiling point of water at sea level?',
        options: ['50°C', '75°C', '100°C', '150°C'],
        answer: 3,
        explanation: 'Water boils at 100°C at standard atmospheric pressure.'
    },
    {
        question: 'Which planet is known as the Red Planet?',
        options: ['Venus', 'Mars', 'Mercury', 'Jupiter'],
        answer: 2,
        explanation: 'Mars appears reddish because of iron oxide on its surface.'
    },
    {
        question: 'What is the chemical symbol for gold?',
        options: ['Ag', 'Au', 'Fe', 'Gd'],
        answer: 2,
        explanation: 'Au is the chemical symbol for gold.'
    },
    {
        question: 'Which part of a plant absorbs water from the soil?',
        options: ['Leaves', 'Flowers', 'Roots', 'Stem'],
        answer: 3,
        explanation: 'Roots absorb water and minerals from the soil.'
    },
    {
        question: 'What is the hardest natural substance?',
        options: ['Iron', 'Diamond', 'Quartz', 'Steel'],
        answer: 2,
        explanation: 'Diamond is the hardest naturally occurring mineral.'
    },

    // 🌍 Geography
    {
        question: 'Which is the largest ocean?',
        options: ['Atlantic', 'Indian', 'Arctic', 'Pacific'],
        answer: 4,
        explanation: 'The Pacific Ocean is the largest ocean.'
    },
    {
        question: 'What is the capital of Japan?',
        options: ['Kyoto', 'Osaka', 'Tokyo', 'Hiroshima'],
        answer: 3,
        explanation: 'Tokyo is the capital of Japan.'
    },
    {
        question: 'Which country is shaped like a boot?',
        options: ['Greece', 'Italy', 'Spain', 'Portugal'],
        answer: 2,
        explanation: 'Italy is famously described as boot-shaped.'
    },
    {
        question: 'What is the largest continent?',
        options: ['Africa', 'Europe', 'Asia', 'North America'],
        answer: 3,
        explanation: 'Asia is the largest continent by area.'
    },
    {
        question: 'Which desert is the largest hot desert?',
        options: ['Gobi', 'Sahara', 'Kalahari', 'Atacama'],
        answer: 2,
        explanation: 'The Sahara is the largest hot desert.'
    },
    {
        question: 'Which country is home to the Great Pyramid of Giza?',
        options: ['Egypt', 'Mexico', 'Greece', 'Iraq'],
        answer: 1,
        explanation: 'The Great Pyramid of Giza is in Egypt.'
    },
    {
        question: 'What is the capital of Australia?',
        options: ['Sydney', 'Melbourne', 'Perth', 'Canberra'],
        answer: 4,
        explanation: 'Canberra is the capital of Australia.'
    },
    {
        question: 'Which river flows through Egypt?',
        options: ['Amazon', 'Nile', 'Danube', 'Yangtze'],
        answer: 2,
        explanation: 'The Nile flows through Egypt.'
    },
    {
        question: 'Which country is famous for the Eiffel Tower?',
        options: ['France', 'Italy', 'Belgium', 'Germany'],
        answer: 1,
        explanation: 'The Eiffel Tower is in Paris, France.'
    },
    {
        question: 'What is the capital of India?',
        options: ['Mumbai', 'Kolkata', 'New Delhi', 'Chennai'],
        answer: 3,
        explanation: 'New Delhi is the capital of India.'
    },

    // 🏛️ History
    {
        question: 'Who was the first person to walk on the Moon?',
        options: ['Buzz Aldrin', 'Neil Armstrong', 'Yuri Gagarin', 'John Glenn'],
        answer: 2,
        explanation: 'Neil Armstrong was the first person to walk on the Moon.'
    },
    {
        question: 'Which ancient civilization built the pyramids at Giza?',
        options: ['Romans', 'Greeks', 'Egyptians', 'Vikings'],
        answer: 3,
        explanation: 'The pyramids at Giza were built by ancient Egyptians.'
    },
    {
        question: 'Who was known as the Maid of Orléans?',
        options: ['Joan of Arc', 'Cleopatra', 'Marie Curie', 'Queen Victoria'],
        answer: 1,
        explanation: 'Joan of Arc is known as the Maid of Orléans.'
    },
    {
        question: 'Which empire was ruled by Julius Caesar?',
        options: ['Roman Empire', 'Ottoman Empire', 'Mongol Empire', 'British Empire'],
        answer: 1,
        explanation: 'Julius Caesar was a Roman military leader and statesman.'
    },
    {
        question: 'Who was the first President of the United States?',
        options: ['Abraham Lincoln', 'George Washington', 'Thomas Jefferson', 'John Adams'],
        answer: 2,
        explanation: 'George Washington was the first U.S. president.'
    },
    {
        question: 'The Titanic sank in which year?',
        options: ['1905', '1912', '1920', '1931'],
        answer: 2,
        explanation: 'The Titanic sank in April 1912.'
    },
    {
        question: 'Which famous wall divided Berlin during the Cold War?',
        options: ['Great Wall', 'Berlin Wall', 'Iron Wall', 'Roman Wall'],
        answer: 2,
        explanation: 'The Berlin Wall divided East and West Berlin.'
    },
    {
        question: 'Who discovered penicillin?',
        options: ['Alexander Fleming', 'Isaac Newton', 'Albert Einstein', 'Louis Pasteur'],
        answer: 1,
        explanation: 'Alexander Fleming discovered penicillin in 1928.'
    },
    {
        question: 'Who was the first emperor of Rome?',
        options: ['Julius Caesar', 'Augustus', 'Nero', 'Hadrian'],
        answer: 2,
        explanation: 'Augustus was the first Roman emperor.'
    },
    {
        question: 'Which civilization developed democracy in Athens?',
        options: ['Romans', 'Greeks', 'Egyptians', 'Persians'],
        answer: 2,
        explanation: 'Ancient Athens developed an early form of democracy.'
    },

    // 🎬 Movies & TV
    {
        question: 'Which movie features the character Jack Dawson?',
        options: ['Avatar', 'Titanic', 'Inception', 'Gladiator'],
        answer: 2,
        explanation: 'Jack Dawson is a character in Titanic.'
    },
    {
        question: 'What is the name of Harry Potter’s owl?',
        options: ['Hedwig', 'Scabbers', 'Crookshanks', 'Fawkes'],
        answer: 1,
        explanation: 'Harry Potter’s owl is named Hedwig.'
    },
    {
        question: 'Which fictional city is Batman associated with?',
        options: ['Metropolis', 'Gotham City', 'Star City', 'Central City'],
        answer: 2,
        explanation: 'Batman protects Gotham City.'
    },
    {
        question: 'What is the name of the cowboy in Toy Story?',
        options: ['Buzz', 'Woody', 'Andy', 'Rex'],
        answer: 2,
        explanation: 'Woody is the cowboy toy in Toy Story.'
    },
    {
        question: 'Which movie features the quote concept of "The Matrix"?',
        options: ['The Matrix', 'Interstellar', 'Terminator', 'Avatar'],
        answer: 1,
        explanation: 'The Matrix is the movie centered around the simulated reality concept.'
    },
    {
        question: 'Who is the main character of The Lion King?',
        options: ['Mufasa', 'Scar', 'Simba', 'Timon'],
        answer: 3,
        explanation: 'Simba is the main protagonist of The Lion King.'
    },
    {
        question: 'What is the name of the school in Harry Potter?',
        options: ['Hogwarts', 'Narnia', 'Xavier Academy', 'Nevermore'],
        answer: 1,
        explanation: 'Harry Potter attends Hogwarts School of Witchcraft and Wizardry.'
    },
    {
        question: 'Which superhero uses a shield as his famous weapon?',
        options: ['Iron Man', 'Thor', 'Captain America', 'Hulk'],
        answer: 3,
        explanation: 'Captain America is famous for his shield.'
    },
    {
        question: 'What is the name of the fictional kingdom in Frozen?',
        options: ['Arendelle', 'Wakanda', 'Genovia', 'Agrabah'],
        answer: 1,
        explanation: 'Frozen takes place primarily in the kingdom of Arendelle.'
    },
    {
        question: 'Which movie features the character Darth Vader?',
        options: ['Star Wars', 'Star Trek', 'Avatar', 'Dune'],
        answer: 1,
        explanation: 'Darth Vader is one of the central characters of Star Wars.'
    },

    // 🎮 Games
    {
        question: 'Which company created Minecraft?',
        options: ['Nintendo', 'Mojang', 'Valve', 'Ubisoft'],
        answer: 2,
        explanation: 'Minecraft was created by Mojang.'
    },
    {
        question: 'What is Mario’s brother called?',
        options: ['Luigi', 'Wario', 'Yoshi', 'Toad'],
        answer: 1,
        explanation: 'Luigi is Mario’s brother.'
    },
    {
        question: 'Which game features the character Pikachu?',
        options: ['Digimon', 'Pokémon', 'Final Fantasy', 'Sonic'],
        answer: 2,
        explanation: 'Pikachu is one of the most famous Pokémon.'
    },
    {
        question: 'What is the main currency in Fortnite?',
        options: ['Robux', 'V-Bucks', 'Coins', 'Gems'],
        answer: 2,
        explanation: 'Fortnite uses V-Bucks as its in-game currency.'
    },
    {
        question: 'Which game series features Master Chief?',
        options: ['Halo', 'Destiny', 'Doom', 'Half-Life'],
        answer: 1,
        explanation: 'Master Chief is the protagonist of the Halo series.'
    },
    {
        question: 'Which company created the PlayStation?',
        options: ['Microsoft', 'Nintendo', 'Sony', 'Sega'],
        answer: 3,
        explanation: 'PlayStation is a gaming brand created by Sony.'
    },
    {
        question: 'Which game features Creepers?',
        options: ['Terraria', 'Minecraft', 'Roblox', 'Fortnite'],
        answer: 2,
        explanation: 'Creepers are iconic enemies in Minecraft.'
    },
    {
        question: 'What is Sonic known for?',
        options: ['Flying', 'Super speed', 'Strength', 'Invisibility'],
        answer: 2,
        explanation: 'Sonic the Hedgehog is famous for his incredible speed.'
    },
    {
        question: 'Which Nintendo character is a princess often associated with Mario?',
        options: ['Peach', 'Zelda', 'Samus', 'Daisy'],
        answer: 1,
        explanation: 'Princess Peach is a major character in the Mario series.'
    },
    {
        question: 'Which game series features the character Link?',
        options: ['Pokémon', 'The Legend of Zelda', 'Metroid', 'Kirby'],
        answer: 2,
        explanation: 'Link is the main hero of The Legend of Zelda series.'
    },

    // ⚽ Sports
    {
        question: 'How many players does a soccer team have on the field?',
        options: ['9', '10', '11', '12'],
        answer: 3,
        explanation: 'A soccer team has 11 players on the field.'
    },
    {
        question: 'Which sport uses a racket and shuttlecock?',
        options: ['Tennis', 'Badminton', 'Squash', 'Table Tennis'],
        answer: 2,
        explanation: 'Badminton is played with a racket and shuttlecock.'
    },
    {
        question: 'How many rings are on the Olympic flag?',
        options: ['4', '5', '6', '7'],
        answer: 2,
        explanation: 'The Olympic flag has five interlocking rings.'
    },
    {
        question: 'Which sport is played at Wimbledon?',
        options: ['Football', 'Tennis', 'Golf', 'Cricket'],
        answer: 2,
        explanation: 'Wimbledon is one of tennis’s most famous tournaments.'
    },
    {
        question: 'How many points is a basketball free throw worth?',
        options: ['1', '2', '3', '4'],
        answer: 1,
        explanation: 'A successful free throw is worth one point.'
    },
    {
        question: 'Which country hosted the 2016 Summer Olympics?',
        options: ['China', 'Brazil', 'Japan', 'UK'],
        answer: 2,
        explanation: 'The 2016 Summer Olympics were held in Rio de Janeiro, Brazil.'
    },
    {
        question: 'Which sport is associated with the Ashes?',
        options: ['Cricket', 'Rugby', 'Tennis', 'Golf'],
        answer: 1,
        explanation: 'The Ashes is a famous cricket rivalry between England and Australia.'
    },
    {
        question: 'How many players are on a basketball team on the court?',
        options: ['4', '5', '6', '7'],
        answer: 2,
        explanation: 'Five players from each team are on the basketball court.'
    },
    {
        question: 'Which sport uses a bat, ball and wickets?',
        options: ['Baseball', 'Cricket', 'Hockey', 'Tennis'],
        answer: 2,
        explanation: 'Cricket is played with a bat, ball and wickets.'
    },
    {
        question: 'What color card means a player is sent off in soccer?',
        options: ['Yellow', 'Blue', 'Red', 'Green'],
        answer: 3,
        explanation: 'A red card means the player is sent off.'
    },

    // 💻 Technology
    {
        question: 'What does CPU stand for?',
        options: [
            'Central Processing Unit',
            'Computer Personal Unit',
            'Central Program Utility',
            'Core Processing User'
        ],
        answer: 1,
        explanation: 'CPU stands for Central Processing Unit.'
    },
    {
        question: 'What does RAM stand for?',
        options: [
            'Random Access Memory',
            'Rapid Application Machine',
            'Read Access Module',
            'Random Application Memory'
        ],
        answer: 1,
        explanation: 'RAM stands for Random Access Memory.'
    },
    {
        question: 'Which company developed Android?',
        options: ['Apple', 'Google', 'Microsoft', 'IBM'],
        answer: 2,
        explanation: 'Android is developed by Google.'
    },
    {
        question: 'What does HTML stand for?',
        options: [
            'HyperText Markup Language',
            'HighText Machine Language',
            'Hyper Transfer Markup Link',
            'Home Tool Markup Language'
        ],
        answer: 1,
        explanation: 'HTML stands for HyperText Markup Language.'
    },
    {
        question: 'Which company created Windows?',
        options: ['Apple', 'Microsoft', 'Google', 'Linux Foundation'],
        answer: 2,
        explanation: 'Microsoft developed Windows.'
    },
    {
        question: 'What does USB stand for?',
        options: [
            'Universal Serial Bus',
            'United System Board',
            'Universal System Backup',
            'User Serial Bridge'
        ],
        answer: 1,
        explanation: 'USB stands for Universal Serial Bus.'
    },
    {
        question: 'Which programming language is represented by the file extension .js?',
        options: ['Java', 'JavaScript', 'JSON', 'JScript++'],
        answer: 2,
        explanation: '.js is commonly used for JavaScript files.'
    },
    {
        question: 'What does AI stand for?',
        options: ['Automated Internet', 'Artificial Intelligence', 'Advanced Interface', 'Artificial Internet'],
        answer: 2,
        explanation: 'AI stands for Artificial Intelligence.'
    },
    {
        question: 'Which company created the iPhone?',
        options: ['Samsung', 'Google', 'Apple', 'Nokia'],
        answer: 3,
        explanation: 'Apple created the iPhone.'
    },
    {
        question: 'What is the main purpose of a web browser?',
        options: [
            'Edit videos',
            'Browse websites',
            'Create hardware',
            'Compile games'
        ],
        answer: 2,
        explanation: 'A web browser is used to access and interact with websites.'
    },

    // 🐾 Animals
    {
        question: 'What is the fastest land animal?',
        options: ['Lion', 'Horse', 'Cheetah', 'Tiger'],
        answer: 3,
        explanation: 'The cheetah is the fastest land animal.'
    },
    {
        question: 'Which is the largest land animal?',
        options: ['Giraffe', 'African elephant', 'Rhino', 'Hippo'],
        answer: 2,
        explanation: 'The African elephant is the largest land animal.'
    },
    {
        question: 'Which animal is known for changing its color?',
        options: ['Chameleon', 'Penguin', 'Dolphin', 'Eagle'],
        answer: 1,
        explanation: 'Chameleons are famous for their ability to change color.'
    },
    {
        question: 'What is a baby dog called?',
        options: ['Kitten', 'Puppy', 'Calf', 'Cub'],
        answer: 2,
        explanation: 'A baby dog is called a puppy.'
    },
    {
        question: 'Which animal is known as the King of the Jungle?',
        options: ['Tiger', 'Lion', 'Elephant', 'Bear'],
        answer: 2,
        explanation: 'The lion is traditionally called the King of the Jungle.'
    },
    {
        question: 'Which bird cannot fly?',
        options: ['Eagle', 'Penguin', 'Falcon', 'Sparrow'],
        answer: 2,
        explanation: 'Penguins are flightless birds.'
    },
    {
        question: 'What is the largest animal on Earth?',
        options: ['Elephant', 'Blue whale', 'Giraffe', 'Great white shark'],
        answer: 2,
        explanation: 'The blue whale is the largest known animal.'
    },
    {
        question: 'Which animal is famous for having a long neck?',
        options: ['Giraffe', 'Zebra', 'Camel', 'Kangaroo'],
        answer: 1,
        explanation: 'The giraffe is famous for its extremely long neck.'
    },
    {
        question: 'Which animal is known for its black and white stripes?',
        options: ['Zebra', 'Tiger', 'Panda', 'Skunk'],
        answer: 1,
        explanation: 'Zebras are famous for their black and white stripes.'
    },
    {
        question: 'What do pandas mainly eat?',
        options: ['Bamboo', 'Fish', 'Grass', 'Fruit'],
        answer: 1,
        explanation: 'Giant pandas mainly eat bamboo.'
    },

    // ➗ Mathematics
    {
        question: 'What is 12 × 8?',
        options: ['86', '96', '108', '112'],
        answer: 2,
        explanation: '12 × 8 = 96.'
    },
    {
        question: 'What is 100 ÷ 4?',
        options: ['20', '25', '30', '40'],
        answer: 2,
        explanation: '100 divided by 4 equals 25.'
    },
    {
        question: 'What is 15 + 27?',
        options: ['32', '40', '42', '45'],
        answer: 3,
        explanation: '15 + 27 = 42.'
    },
    {
        question: 'What is 50 - 18?',
        options: ['28', '30', '32', '34'],
        answer: 3,
        explanation: '50 - 18 = 32.'
    },
    {
        question: 'What is 9 × 9?',
        options: ['72', '81', '90', '99'],
        answer: 2,
        explanation: '9 × 9 = 81.'
    },
    {
        question: 'What is the square root of 64?',
        options: ['6', '7', '8', '9'],
        answer: 3,
        explanation: 'The square root of 64 is 8.'
    },
    {
        question: 'What is 7 × 6?',
        options: ['36', '42', '48', '56'],
        answer: 2,
        explanation: '7 × 6 = 42.'
    },
    {
        question: 'What is 144 ÷ 12?',
        options: ['10', '11', '12', '14'],
        answer: 3,
        explanation: '144 divided by 12 equals 12.'
    },
    {
        question: 'What is 25% of 100?',
        options: ['10', '20', '25', '50'],
        answer: 3,
        explanation: '25% of 100 is 25.'
    },
    {
        question: 'What is 5³?',
        options: ['15', '25', '100', '125'],
        answer: 4,
        explanation: '5³ means 5 × 5 × 5 = 125.'
    },

    // 🎵 Music
    {
        question: 'How many strings does a standard guitar usually have?',
        options: ['4', '5', '6', '7'],
        answer: 3,
        explanation: 'A standard guitar usually has six strings.'
    },
    {
        question: 'Which instrument has black and white keys?',
        options: ['Guitar', 'Piano', 'Violin', 'Flute'],
        answer: 2,
        explanation: 'A piano has black and white keys.'
    },
    {
        question: 'How many notes are in a basic musical scale?',
        options: ['5', '6', '7', '8'],
        answer: 3,
        explanation: 'A basic diatonic scale contains seven notes.'
    },
    {
        question: 'Which instrument belongs to the string family?',
        options: ['Trumpet', 'Violin', 'Flute', 'Drum'],
        answer: 2,
        explanation: 'The violin is a string instrument.'
    },
    {
        question: 'Which instrument is commonly played with drumsticks?',
        options: ['Piano', 'Drums', 'Violin', 'Flute'],
        answer: 2,
        explanation: 'Drumsticks are commonly used to play drums.'
    },
    {
        question: 'What device is commonly used to listen to music privately?',
        options: ['Headphones', 'Router', 'Keyboard', 'Monitor'],
        answer: 1,
        explanation: 'Headphones allow private listening to music.'
    },
    {
        question: 'Which musical symbol indicates silence?',
        options: ['Rest', 'Clef', 'Sharp', 'Flat'],
        answer: 1,
        explanation: 'A rest indicates a period of silence in music.'
    },
    {
        question: 'Which instrument commonly has four strings?',
        options: ['Violin', 'Piano', 'Flute', 'Trumpet'],
        answer: 1,
        explanation: 'A standard violin has four strings.'
    },
    {
        question: 'What is a group of singers called?',
        options: ['Choir', 'Orchestra', 'Bandstand', 'Quartet'],
        answer: 1,
        explanation: 'A group of singers is commonly called a choir.'
    },
    {
        question: 'What is the speed of a piece of music called?',
        options: ['Tempo', 'Pitch', 'Volume', 'Harmony'],
        answer: 1,
        explanation: 'Tempo describes the speed of music.'
    },

    // 🌟 Mixed
    {
        question: 'How many colors are traditionally listed in a rainbow?',
        options: ['5', '6', '7', '8'],
        answer: 3,
        explanation: 'The traditional list contains seven colors.'
    },
    {
        question: 'What is the opposite of "ancient"?',
        options: ['Old', 'Modern', 'Historic', 'Early'],
        answer: 2,
        explanation: 'Modern is the opposite of ancient.'
    },
    {
        question: 'Which shape has three sides?',
        options: ['Square', 'Triangle', 'Pentagon', 'Circle'],
        answer: 2,
        explanation: 'A triangle has three sides.'
    },
    {
        question: 'How many months are in a year?',
        options: ['10', '11', '12', '13'],
        answer: 3,
        explanation: 'There are 12 months in a year.'
    },
    {
        question: 'Which material is made from trees and commonly used for writing?',
        options: ['Glass', 'Paper', 'Steel', 'Plastic'],
        answer: 2,
        explanation: 'Paper is commonly produced from wood pulp.'
    },
    {
        question: 'What is frozen water called?',
        options: ['Steam', 'Ice', 'Mist', 'Frost'],
        answer: 2,
        explanation: 'Frozen water is ice.'
    },
    {
        question: 'Which sense organ is used for seeing?',
        options: ['Ear', 'Nose', 'Eye', 'Tongue'],
        answer: 3,
        explanation: 'Eyes are the organs responsible for vision.'
    },
    {
        question: 'What do bees produce?',
        options: ['Milk', 'Honey', 'Silk', 'Wax only'],
        answer: 2,
        explanation: 'Bees produce honey.'
    },
    {
        question: 'Which day comes after Friday?',
        options: ['Thursday', 'Saturday', 'Sunday', 'Monday'],
        answer: 2,
        explanation: 'Saturday comes after Friday.'
    },
    {
        question: 'What is the primary color produced by mixing red and blue paint?',
        options: ['Green', 'Orange', 'Purple', 'Yellow'],
        answer: 3,
        explanation: 'Red and blue paint traditionally mix to make purple.'
    }
];

// Active quizzes per chat
const activeQuizzes = new Map();

// User scores
const scores = new Map();

function getSenderId(message) {
    return (
        message.key?.participant ||
        message.participant ||
        message.key?.remoteJid ||
        'unknown'
    );
}

function getMentionTag(sender) {
    return sender.split('@')[0];
}

async function quizCommand(sock, chatId, message) {
    const existingQuiz = activeQuizzes.get(chatId);

    if (existingQuiz) {
        return await sock.sendMessage(
            chatId,
            {
                text: '⚠️ A quiz is already running in this chat!\n\nAnswer the current question first.'
            },
            { quoted: message }
        );
    }

    const question =
        questions[Math.floor(Math.random() * questions.length)];

    const quiz = {
        ...question,
        startedBy: getSenderId(message),
        expiresAt: Date.now() + 30000
    };

    activeQuizzes.set(chatId, quiz);

    const optionsText = quiz.options
        .map((option, index) => `${index + 1}. ${option}`)
        .join('\n');

    await sock.sendMessage(
        chatId,
        {
            text:
                `🧠 *KELLY-MD QUIZ*\n\n` +
                `❓ *Question:*\n${quiz.question}\n\n` +
                `*Options:*\n${optionsText}\n\n` +
                `⏱️ You have *30 seconds*!\n` +
                `Reply with the option number.\n\n` +
                `Example: *2*`
        },
        { quoted: message }
    );

    setTimeout(async () => {
        const currentQuiz = activeQuizzes.get(chatId);

        if (currentQuiz === quiz) {
            activeQuizzes.delete(chatId);

            await sock.sendMessage(chatId, {
                text:
                    `⏰ *Time's up!*\n\n` +
                    `The correct answer was *${quiz.answer}. ${quiz.options[quiz.answer - 1]}*.\n\n` +
                    `💡 ${quiz.explanation}`
            });
        }
    }, 30000);
}

async function handleQuizAnswer(sock, chatId, message, answer) {
    const quiz = activeQuizzes.get(chatId);

    if (!quiz) return false;

    if (Date.now() > quiz.expiresAt) {
        activeQuizzes.delete(chatId);
        return false;
    }

    const choice = parseInt(answer.trim(), 10);

    if (![1, 2, 3, 4].includes(choice)) {
        return false;
    }

    activeQuizzes.delete(chatId);

    const sender = getSenderId(message);
    const senderName = getMentionTag(sender);

    if (choice === quiz.answer) {
        const oldScore = scores.get(sender) || 0;
        const newScore = oldScore + 1;

        scores.set(sender, newScore);

        await sock.sendMessage(
            chatId,
            {
                text:
                    `🎉 *Correct, @${senderName}!*\n\n` +
                    `✅ *${quiz.options[quiz.answer - 1]}* is the right answer!\n\n` +
                    `💡 ${quiz.explanation}\n\n` +
                    `🏆 Your score: *${newScore}* point${newScore === 1 ? '' : 's'}`,
                mentions: [sender]
            },
            { quoted: message }
        );
    } else {
        await sock.sendMessage(
            chatId,
            {
                text:
                    `❌ *Wrong answer, @${senderName}!*\n\n` +
                    `The correct answer was:\n` +
                    `✅ *${quiz.answer}. ${quiz.options[quiz.answer - 1]}*\n\n` +
                    `💡 ${quiz.explanation}`,
                mentions: [sender]
            },
            { quoted: message }
        );
    }

    return true;
}

module.exports = {
    quizCommand,
    handleQuizAnswer
};
