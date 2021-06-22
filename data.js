const faker = require('faker');
const bcrypt = require('bcryptjs');
var db = require("./server/models")

const sleep = (milliseconds) => {
    return new Promise(resolve => setTimeout(resolve, milliseconds))
}
let DogName = ["Bella", "Max", "Charlie", "Coco", "Lola", "Rocky", "Buddy", "Lucy", "Lucky", "Daisy", "Luna", "Bailey", "Princess", "Teddy", "Chloe", "Toby", "Molly", "Jack", "Milo", "Oliver", "Maggie", "Penny", "Sophie", "Lily", "Cooper", "Oreo", "Mia", "Leo", "Cookie", "Lulu", "Ruby", "Stella", "Prince", "Gizmo", "Ginger", "Riley", "Rosie", "Roxy", "Sasha", "Cody", "Lady", "Sadie", "Oscar", "Zoey", "Buster", "Baby", "Shadow", "Jake", "Bruno", "Zoe", "Henry", "Sammy", "Pepper", "Bear", "Blue", "Rocco", "Duke", "Louie", "Peanut", "Frankie", "Dexter", "Gracie", "King", "Sandy", "Honey", "Benji", "Bentley", "Rex", "Scout", "Sparky", "Zeus", "Brooklyn", "Harley", "Rusty", "Winston", "Sam", "Emma", "Jasper", "Snoopy", "Lilly", "Angel", "George", "Bandit", "Romeo", "Jax", "Layla", "Olive", "Minnie", "Abby", "Tucker", "Simba", "Jackson", "Brownie", "Nala", "Lexi", "Hazel", "Murphy", "Mickey", "Diamond", "Hudson", "Gigi", "Maximus", "Tyson", "Hunter", "Madison", "Ella", "Ellie", "Mimi", "Gus", "Maya", "Chewy", "Joey", "Missy", "Ace", "Chester", "Baxter", "Remy", "Precious", "Pebbles", "Casey", "Harry", "Ollie", "Fluffy", "Benny", "Roxie", "Marley", "Ziggy", "Annie", "Mocha", "Otis", "Piper", "Belle", "Spike", "Chase", "Apollo", "Chico", "Sugar", "Archie", "Nina", "Mr.", "Loki", "Phoebe", "Smokey", "Name", "Bruce", "Biscuit", "Cocoa", "Rufus", "Thor", "Diesel", "Nena", "Trixie", "Penelope", "Samson", "Rudy", "Holly", "Finn", "Happy", "Samantha", "Not", "Dakota", "Elvis", "Brandy", "Sunny", "Foxy", "Parker", "Simon", "Willow", "Millie", "Betty", "Izzy", "Casper", "Mason", "Tiger", "Hershey", "Petey", "Sonny", "Bobby", "Gucci", "Dixie", "Little", "Yogi", "Winnie", "Luke", "Maddie", "Kobe", "Hank", "Blu", "Boomer", "Kiki", "Fiona", "Rambo", "Muffin", "Boo", "Alfie", "Katie", "Wally", "Cosmo", "Onyx", "Mochi", "Tiny", "Shea", "Junior", "Otto", "Snowball", "Sophia", "Ozzy", "Nikki", "Chance", "Sky", "Chewie", "Ava", "Jackie", "Star", "Hugo", "Misty", "Champ", "Bonnie", "Hercules", "Cinnamon", "Roscoe", "Andy", "Delilah", "Logan", "Reggie", "Scooby", "Spencer", "Ricky", "Maxwell", "Lexie", "Monty", "Cash", "Brody", "Barney", "Nico", "Midnight", "Olivia", "Bosco", "Beau", "Mikey", "Jasmine", "Xena", "Charlotte", "Walter", "Niko", "Callie", "Stanley", "Moose", "Lucas", "Paris", "Panda", "Willie", "Spanky", "Chip", "Luca", "Josie", "Cassie", "Watson", "Chelsea", "Dino", "Koko", "Miles", "Snowy", "Brady", "Enzo", "Cleo", "Chanel", "Grace", "Sebastian", "Isabella", "Athena", "Jessie", "Snow", "Louis", "Bowie", "Charley", "Jojo", "Bo", "Scruffy", "Diego", "Bambi", "Dusty", "Koda", "Amber", "Dolly", "Scrappy", "Lacey", "Billy", "Patches", "Jesse", "Brutus", "Poppy", "Nemo", "Mabel", "Storm", "Theodore", "Pumpkin", "Yoshi", "Theo", "Bernie", "Tommy", "Taz", "Dante", "Clyde", "Scooter", "Violet", "Duncan", "Miss", "Cindy", "Bobo", "Sheba", "Shelby", "Ben", "Heidi", "Sassy", "Sir", "Matilda", "Diva", "Murray", "Fred", "April", "Eddie", "Tiffany", "Dolce", "Alex", "Tony", "Winter", "Dylan", "Ranger", "Skye", "Noah", "Gia", "Dallas", "Pippa", "Sally", "Goldie", "Lila", "Nellie", "Baci", "Mojo", "Cali", "Benjamin", "Bubba", "Napoleon", "Linda", "Juno", "Georgia", "Kona", "Summer", "Sydney", "Harvey", "Jerry", "Candy", "Khloe", "Zelda", "Harper", "Eli", "Peaches", "Jade", "Chewbacca", "Franklin", "Jimmy", "Scarlett", "Mugsy", "Sofia", "Ozzie", "Guinness", "Tootsie", "Suki", "Rocket", "Tyler", "Major", "Paco", "Frank", "Abigail", "Buttercup", "Momo", "Snickers", "Bebe", "Chocolate", "Linus", "Tina", "Pepe", "Duchess", "Mookie", "Bubbles", "Polo", "Gatsby", "Hannah", "Nino", "Skippy", "Mac", "Biggie", "Mila", "Mika", "Kane", "Maxine", "Percy", "Taco", "Yoda", "Amy", "Rose", "Moxie", "Quincy", "Rico", "Pearl", "Blackie", "Kelly", "Nova", "Tito", "Freddie", "Frida", "Leila", "Bam", "Nicky", "Cupcake", "Rio", "Bianca", "Marty", "Ivy", "Blaze", "Pixie", "Mister", "Ernie", "Mack", "Hope", "Barkley", "Lilo", "Tinkerbell", "Kiwi", "Melo", "Odin", "Tallulah", "Mandy", "Toto", "Sofie", "Tank", "Puppy", "Pablo", "Odie", "Macho", "Dash", "Caesar", "Pinky", "Alice", "Basil", "Maxx", "Georgie", "Whiskey", "Shaggy", "Jazz", "Eva", "Pete", "Buttons", "Emily", "Stitch", "Rascal", "Domino", "Jacob", "Wilson", "Spot", "Maxie", "Nikko", "Quinn", "Jeter", "Red", "Atticus", "Billie", "Terry", "Kirby", "Susie", "DJ", "Savannah", "Faith", "Jordan", "Shiloh", "Tigger", "London", "Fritz", "Felix", "Iggy", "Ringo", "Butter", "Kuma", "Clementine", "Rocko", "Miley", "Sammie", "Brandi", "Dottie", "Zorro", "Zeke", "Choco", "Maisie", "Sunshine", "Lala", "Leia", "Jazzy", "Gemma", "Ripley", "Lincoln", "Mylo", "Dora", "Sherlock", "Coconut", "Jay", "Stevie", "Einstein", "Morgan", "Marco", "Titan", "Comet", "Kira", "Butch", "Nola", "Yuki", "Roger", "Laila", "Jenny", "Valentino", "Charles", "Mango", "Stewie", "Tobi", "Ariel", "Captain", "Freddy", "Lana", "Gypsy", "Rosco", "Buffy", "Isis", "Arthur", "Maisy", "Griffin", "Dutchess", "Kali", "Dobby", "Axel", "Jet", "Bodhi", "Kaya", "Betsy", "Mr", "Emmy", "Leonardo", "Pippin", "Munchkin", "Cotton", "Jada", "Willy", "Monkey", "Queenie", "June", "Reilly", "Astro", "Nacho", "Homer", "Ralph", "Luigi", "Elsa", "Levi", "Darla", "Finnegan", "Waffles", "Cleopatra", "Pluto", "Apple", "Tasha", "Mollie", "Skylar", "Maple", "Pip", "Seamus", "Woody", "Eloise", "Vinny", "Lula", "Daphne", "Blacky", "Dutch", "Nugget", "Banjo", "Kayla", "Kai", "Chi", "Joy", "Tessa", "Trouble", "Wallace", "Frances", "Copper", "Tara", "Poochie", "Wrigley", "CJ", "Gino", "Flash", "Magic", "Thomas", "Angus", "Tango", "Bibi", "Dudley", "Sarah", "Bessie", "Cherry", "Sage", "Manny", "Ghost", "Norman", "Mona", "Rupert", "Achilles", "Butters", "Evie", "Timmy", "Beauty", "Rory", "Kato", "Alexander", "Austin", "Cuddles", "Sparkle", "Wilbur", "Troy", "Luka", "Indie", "Hachi", "Boris", "Jersey", "Spartacus", "Carter", "Lenny", "Tess", "Shorty", "Suzy", "Johnny", "Maxi", "Mya", "Allie", "Chiquita", "Django", "Coby", "Scarlet", "Eleanor", "Pookie", "Tiki", "Petunia", "Suzie", "Opie", "Fifi", "Nora", "Autumn", "Maddy", "Pepsi", "Mini", "Arlo", "Sampson", "Moe", "Julie", "Hamilton", "Caramel", "Bob", "Pancho", "Ryder", "Bishop", "Xiao", "Keiko", "Ralphie", "JJ", "Remington", "Clover", "Coffee", "Mindy", "Sweetie", "Kylie", "Birdie", "Mama", "Snowflake", "Laika", "Misha", "Bronx", "Sabrina", "Remi", "Papi", "Boots", "Louise", "Polly", "Bucky", "Bagel", "Benson", "Lou", "Lil", "Oso", "Victoria", "Destiny", "Buzz", "Chucky", "Duffy", "Bunny", "Raven", "Puffy", "Juliet", "Augie", "Sherman", "Buddha", "Ebony", "Nyla", "Kody", "Bingo", "Pickles", "Roy", "Zara", "Indy", "Kingston", "Memphis", "Calvin", "Truffle", "Trooper", "Becky", "Goose", "Aurora", "Avery", "Nathan", "Abbey", "Queen", "Arya", "Bijou", "Oakley", "Chica", "Humphrey", "Lili", "Nelly", "Bugsy", "Bean", "Sweet", "Echo", "Amelia", "Addie", "Aj", "Cricket", "Cesar", "Ashley", "Zena", "Archer", "Jane", "Gina", "Iris", "Nick", "Bullet", "Muneca", "Darby", "Capone", "Maverick", "Mary", "India", "Jameson", "Carly", "Dior", "Ice", "Lyla", "Gotti", "Roxanne", "Hailey", "Reeses", "Joe", "Big", "Pickle", "Snuggles", "Annabelle", "Lupe", "Libby", "Meeko", "Gabby", "Chuck", "Charly", "Wiley", "Blake", "Zero", "River", "Skipper", "Jelly", "Augustus", "Kilo", "Darcy", "James", "Perla", "Albert", "Chichi", "Freckles", "Clara", "Reese", "Dunkin", "Doc", "Fendi", "Black", "Phoenix", "Mario", "Macy", "Angie", "Lizzie", "Ally", "Popcorn", "Noel", "Agnes", "Lolita", "Sara", "Meatball", "Vito", "Thunder", "Baron", "Dee", "Russell", "Nigel", "Bradley", "Nene", "Truman", "Sarge", "Julius", "Dulce", "Yoyo", "Herbie", "Java", "Gunner", "Hiro", "Indiana", "Peter", "Barley", "Pierre", "Marshmallow", "Brodie", "Peggy", "Moby", "Sookie", "PJ", "Sammi", "Halo", "Mishka", "Merlin", "Edie", "Milly", "Puck", "Zack", "Twinkie", "Marcus", "Robin", "Kobi", "Lobo", "Presley", "Blanca", "Brando", "Marshall", "Noodle", "Venus", "Taffy", "Jinx", "Monte", "Jezebel", "Greta", "Valentina", "Shayna", "Ash", "Freya", "Maui", "Cutie", "Lexy", "Lilah", "Sawyer", "Tino", "Wolfie", "Chai", "Owen", "Hero", "Nana", "Darwin", "Alvin", "Blondie", "Bully", "Emmie", "Paisley", "Gidget", "Gunther", "Bane", "Obi", "Bacon", "Zooey", "Peluche", "Martin", "Bodie", "Bruiser", "Sable", "Audrey", "Roo", "Melody", "Marvin", "Scotty", "Kaiser", "Rita", "Cora", "Shane", "Kitty", "Cheech", "China", "Crystal", "Wyatt", "Buck", "Noodles", "August", "Cashew", "Sienna", "Sidney", "Isabelle", "Ophelia", "Buckley", "Cyrus", "Colby", "Hendrix", "Cassidy", "Brewster", "Lizzy", "Browny", "Taylor", "Tobey", "Jamie", "Finley", "Hana", "Neo", "Orion", "Sheila", "Snoop", "Ajax", "Batman", "Ike", "Trevor", "Ari", "Harlow", "Brooke", "Danny", "Dory", "Moses", "Travis", "Clancy", "Harlem", "Boy", "Wendy", "Liam", "Miso", "Leroy", "Sushi", "Hobbes", "TJ", "Hennessy", "Lexington", "Shakira", "Corky", "Shiro", "Kodi", "Flora", "Cici", "Atlas", "Floyd", "Porter", "Ty", "Artie", "Chulo", "Paulie", "Juniper", "Mo", "Chiqui", "Oskar", "Jaxx", "Yankee", "Cole", "Fox", "Kenny", "Friday", "Lucille", "Skyler", "Gio", "Marcel", "Grayson", "Rugby", "Nikita", "Anna", "Natasha", "Zachary", "Desi", "Gordo", "Mike", "Wednesday", "Lacy", "Grizzly", "Wolfgang", "Haley", "Nash", "Sailor", "Cara", "Preston", "Tammy"]
let DogBreed = ["Affenpinscher", "Afghan Hound", "Aidi", "Airedale Terrier", "Akbash Dog", "Akita", "Alano Español", "Alaskan Klee Kai", "Alaskan Malamute", "Alpine Dachsbracke", "Alpine Spaniel", "American Bulldog", "American Cocker Spaniel", "American Eskimo Dog", "American Foxhound", "American Hairless Terrier", "American Pit Bull Terrier", "American Staffordshire Terrier", "American Water Spaniel", "Anglo-Français de Petite Vénerie", "Appenzeller Sennenhund", "Ariege Pointer", "Ariegeois", "Armant", "Armenian Gampr dog", "Artois Hound", "Australian Cattle Dog", "Australian Kelpie", "Australian Shepherd", "Australian Silky Terrier", "Australian Stumpy Tail Cattle Dog", "Australian Terrier", "Azawakh", "Bakharwal Dog", "Barbet", "Basenji", "Basque Shepherd Dog", "Basset Artésien Normand", "Basset Bleu de Gascogne", "Basset Fauve de Bretagne", "Basset Hound", "Bavarian Mountain Hound", "Beagle", "Beagle-Harrier", "Bearded Collie", "Beauceron", "Bedlington Terrier", "Belgian Shepherd Dog (Groenendael)", "Belgian Shepherd Dog (Laekenois)", "Belgian Shepherd Dog (Malinois)", "Bergamasco Shepherd", "Berger Blanc Suisse", "Berger Picard", "Berner Laufhund", "Bernese Mountain Dog", "Billy", "Black and Tan Coonhound", "Black and Tan Virginia Foxhound", "Black Norwegian Elkhound", "Black Russian Terrier", "Bloodhound", "Blue Lacy", "Blue Paul Terrier", "Boerboel", "Bohemian Shepherd", "Bolognese", "Border Collie", "Border Terrier", "Borzoi", "Boston Terrier", "Bouvier des Ardennes", "Bouvier des Flandres", "Boxer", "Boykin Spaniel", "Bracco Italiano", "Braque d'Auvergne", "Braque du Bourbonnais", "Braque du Puy", "Braque Francais", "Braque Saint-Germain", "Brazilian Terrier", "Briard", "Briquet Griffon Vendéen", "Brittany", "Broholmer", "Bruno Jura Hound", "Bucovina Shepherd Dog", "Bull and Terrier", "Bull Terrier (Miniature)", "Bull Terrier", "Bulldog", "Bullenbeisser", "Bullmastiff", "Bully Kutta", "Burgos Pointer", "Cairn Terrier", "Canaan Dog", "Canadian Eskimo Dog", "Cane Corso", "Cardigan Welsh Corgi", "Carolina Dog", "Carpathian Shepherd Dog", "Catahoula Cur", "Catalan Sheepdog", "Caucasian Shepherd Dog", "Cavalier King Charles Spaniel", "Central Asian Shepherd Dog", "Cesky Fousek", "Cesky Terrier", "Chesapeake Bay Retriever", "Chien Français Blanc et Noir", "Chien Français Blanc et Orange", "Chien Français Tricolore", "Chien-gris", "Chihuahua", "Chilean Fox Terrier", "Chinese Chongqing Dog", "Chinese Crested Dog", "Chinese Imperial Dog", "Chinook", "Chippiparai", "Chow Chow", "Cierny Sery", "Cimarrón Uruguayo", "Cirneco dell'Etna", "Clumber Spaniel", "Combai", "Cordoba Fighting Dog", "Coton de Tulear", "Cretan Hound", "Croatian Sheepdog", "Cumberland Sheepdog", "Curly Coated Retriever", "Cursinu", "Cão da Serra de Aires", "Cão de Castro Laboreiro", "Cão Fila de São Miguel", "Dachshund", "Dalmatian", "Dandie Dinmont Terrier", "Danish Swedish Farmdog", "Deutsche Bracke", "Doberman Pinscher", "Dogo Argentino", "Dogo Cubano", "Dogue de Bordeaux", "Drentse Patrijshond", "Drever", "Dunker", "Dutch Shepherd Dog", "Dutch Smoushond", "East Siberian Laika", "East-European Shepherd", "Elo", "English Cocker Spaniel", "English Foxhound", "English Mastiff", "English Setter", "English Shepherd", "English Springer Spaniel", "English Toy Terrier (Black &amp; Tan)", "English Water Spaniel", "English White Terrier", "Entlebucher Mountain Dog", "Estonian Hound", "Estrela Mountain Dog", "Eurasier", "Field Spaniel", "Fila Brasileiro", "Finnish Hound", "Finnish Lapphund", "Finnish Spitz", "Flat-Coated Retriever", "Formosan Mountain Dog", "Fox Terrier (Smooth)", "French Bulldog", "French Spaniel", "Galgo Español", "Gascon Saintongeois", "German Longhaired Pointer", "German Pinscher", "German Shepherd", "German Shorthaired Pointer", "German Spaniel", "German Spitz", "German Wirehaired Pointer", "Giant Schnauzer", "Glen of Imaal Terrier", "Golden Retriever", "Gordon Setter", "Gran Mastín de Borínquen", "Grand Anglo-Français Blanc et Noir", "Grand Anglo-Français Blanc et Orange", "Grand Anglo-Français Tricolore", "Grand Basset Griffon Vendéen", "Grand Bleu de Gascogne", "Grand Griffon Vendéen", "Great Dane", "Great Pyrenees", "Greater Swiss Mountain Dog", "Greek Harehound", "Greenland Dog", "Greyhound", "Griffon Bleu de Gascogne", "Griffon Bruxellois", "Griffon Fauve de Bretagne", "Griffon Nivernais", "Hamiltonstövare", "Hanover Hound", "Hare Indian Dog", "Harrier", "Havanese", "Hawaiian Poi Dog", "Himalayan Sheepdog", "Hokkaido", "Hovawart", "Huntaway", "Hygenhund", "Ibizan Hound", "Icelandic Sheepdog", "Indian pariah dog", "Indian Spitz", "Irish Red and White Setter", "Irish Setter", "Irish Terrier", "Irish Water Spaniel", "Irish Wolfhound", "Istrian Coarse-haired Hound", "Istrian Shorthaired Hound", "Italian Greyhound", "Jack Russell Terrier", "Jagdterrier", "Jämthund", "Kai Ken", "Kaikadi", "Kanni", "Karelian Bear Dog", "Karst Shepherd", "Keeshond", "Kerry Beagle", "Kerry Blue Terrier", "King Charles Spaniel", "King Shepherd", "Kintamani", "Kishu", "Komondor", "Kooikerhondje", "Koolie", "Korean Jindo Dog", "Kromfohrländer", "Kumaon Mastiff", "Kurī", "Kuvasz", "Kyi-Leo", "Labrador Husky", "Labrador Retriever", "Lagotto Romagnolo", "Lakeland Terrier", "Lancashire Heeler", "Landseer", "Lapponian Herder", "Large Münsterländer", "Leonberger", "Lhasa Apso", "Lithuanian Hound", "Longhaired Whippet", "Löwchen", "Mahratta Greyhound", "Maltese", "Manchester Terrier", "Maremma Sheepdog", "McNab", "Mexican Hairless Dog", "Miniature American Shepherd", "Miniature Australian Shepherd", "Miniature Fox Terrier", "Miniature Pinscher", "Miniature Schnauzer", "Miniature Shar Pei", "Molossus", "Montenegrin Mountain Hound", "Moscow Watchdog", "Moscow Water Dog", "Mountain Cur", "Mucuchies", "Mudhol Hound", "Mudi", "Neapolitan Mastiff", "New Zealand Heading Dog", "Newfoundland", "Norfolk Spaniel", "Norfolk Terrier", "Norrbottenspets", "North Country Beagle", "Northern Inuit Dog", "Norwegian Buhund", "Norwegian Elkhound", "Norwegian Lundehund", "Norwich Terrier", "Old Croatian Sighthound", "Old Danish Pointer", "Old English Sheepdog", "Old English Terrier", "Old German Shepherd Dog", "Olde English Bulldogge", "Otterhound", "Pachon Navarro", "Paisley Terrier", "Pandikona", "Papillon", "Parson Russell Terrier", "Patterdale Terrier", "Pekingese", "Pembroke Welsh Corgi", "Perro de Presa Canario", "Perro de Presa Mallorquin", "Peruvian Hairless Dog", "Petit Basset Griffon Vendéen", "Petit Bleu de Gascogne", "Phalène", "Pharaoh Hound", "Phu Quoc ridgeback dog", "Picardy Spaniel", "Plott Hound", "Podenco Canario", "Pointer (dog breed)", "Polish Greyhound", "Polish Hound", "Polish Hunting Dog", "Polish Lowland Sheepdog", "Polish Tatra Sheepdog", "Pomeranian", "Pont-Audemer Spaniel", "Poodle", "Porcelaine", "Portuguese Podengo", "Portuguese Pointer", "Portuguese Water Dog", "Posavac Hound", "Pražský Krysařík", "Pudelpointer", "Pug", "Puli", "Pumi", "Pungsan Dog", "Pyrenean Mastiff", "Pyrenean Shepherd", "Rafeiro do Alentejo", "Rajapalayam", "Rampur Greyhound", "Rastreador Brasileiro", "Rat Terrier", "Ratonero Bodeguero Andaluz", "Redbone Coonhound", "Rhodesian Ridgeback", "Rottweiler", "Rough Collie", "Russell Terrier", "Russian Spaniel", "Russian tracker", "Russo-European Laika", "Sabueso Español", "Saint-Usuge Spaniel", "Sakhalin Husky", "Saluki", "Samoyed", "Sapsali", "Schapendoes", "Schillerstövare", "Schipperke", "Schweizer Laufhund", "Schweizerischer Niederlaufhund", "Scotch Collie", "Scottish Deerhound", "Scottish Terrier", "Sealyham Terrier", "Segugio Italiano", "Seppala Siberian Sleddog", "Serbian Hound", "Serbian Tricolour Hound", "Shar Pei", "Shetland Sheepdog", "Shiba Inu", "Shih Tzu", "Shikoku", "Shiloh Shepherd Dog", "Siberian Husky", "Silken Windhound", "Sinhala Hound", "Skye Terrier", "Sloughi", "Slovak Cuvac", "Slovakian Rough-haired Pointer", "Small Greek Domestic Dog", "Small Münsterländer", "Smooth Collie", "South Russian Ovcharka", "Southern Hound", "Spanish Mastiff", "Spanish Water Dog", "Spinone Italiano", "Sporting Lucas Terrier", "St. Bernard", "St. John's water dog", "Stabyhoun", "Staffordshire Bull Terrier", "Standard Schnauzer", "Stephens Cur", "Styrian Coarse-haired Hound", "Sussex Spaniel", "Swedish Lapphund", "Swedish Vallhund", "Tahltan Bear Dog", "Taigan", "Talbot", "Tamaskan Dog", "Teddy Roosevelt Terrier", "Telomian", "Tenterfield Terrier", "Thai Bangkaew Dog", "Thai Ridgeback", "Tibetan Mastiff", "Tibetan Spaniel", "Tibetan Terrier", "Tornjak", "Tosa", "Toy Bulldog", "Toy Fox Terrier", "Toy Manchester Terrier", "Toy Trawler Spaniel", "Transylvanian Hound", "Treeing Cur", "Treeing Walker Coonhound", "Trigg Hound", "Tweed Water Spaniel", "Tyrolean Hound", "Vizsla", "Volpino Italiano", "Weimaraner", "Welsh Sheepdog", "Welsh Springer Spaniel", "Welsh Terrier", "West Highland White Terrier", "West Siberian Laika", "Westphalian Dachsbracke", "Wetterhoun", "Whippet", "White Shepherd", "Wire Fox Terrier", "Wirehaired Pointing Griffon", "Wirehaired Vizsla", "Yorkshire Terrier", "Šarplaninac"]
let gender = ['male', "female"]


const data = async () => {
    for (let index = 0; index < 1; index++) {
        // await sleep(300)
        let body = {
            firstName: faker.name.firstName("male"),
            lastName: faker.name.lastName("male"),
            gender: "male",
            password: bcrypt.hashSync('123', 10),
            photo: [],
            media: [],
            city: faker.address.city(),
            State: faker.address.state(),
            postcode: faker.address.zipCode(),
            phoneNumber: faker.phone.phoneNumber("+91##########"),
            bio: faker.lorem.sentence(25),
            tagline: faker.lorem.sentence(10),
            is_manual: true,
            provider: "manual",
            latitude: faker.address.latitude(21.0000000, 21.9999999, 7),
            longitude: faker.address.longitude(72.000000, 72.999999, 7),
            maximumDistance: faker.datatype.number(100)
        }

        body = {
            ...body,
            email: faker.internet.email(body.firstName, body.lastName, "gmail.com"),
            username: faker.internet.userName(body.firstName, body.lastName),
        }

        let pet = {
            name: faker.random.arrayElement(DogName),
            type: "",
            photo: [],
            breed: faker.random.arrayElement(DogBreed),
            secondaryBreed: faker.random.arrayElement(DogBreed),
            age: faker.datatype.number(15),
            sex: faker.random.arrayElement(gender),
            size: faker.datatype.number(),
            bio: faker.lorem.sentences(2)
        }

        db.User.create(body).then(user => {
            console.log(user)
            pet.UserId = user.id
            // db.Pet.create(pet)
        }).catch(error => {
            console.log(error);
        })

    }
    for (let index = 0; index < 1; index++) {
        // await sleep(300)
        let body = {
            firstName: faker.name.firstName("female"),
            lastName: faker.name.lastName("female"),
            gender: "female",
            password: bcrypt.hashSync('123', 10),
            photo: [],
            media: [],
            city: faker.address.city(),
            State: faker.address.state(),
            postcode: faker.address.zipCode(),
            phoneNumber: faker.phone.phoneNumber("+91##########"),
            bio: faker.lorem.sentence(25),
            tagline: faker.lorem.sentence(10),
            is_manual: true,
            provider: "manual",
            latitude: faker.address.latitude(21.0000000, 21.9999999, 7),
            longitude: faker.address.longitude(72.000000, 72.999999, 7),
            maximumDistance: faker.datatype.number(100)
        }

        body = {
            ...body,
            email: faker.internet.email(body.firstName, body.lastName, "gmail.com"),
            username: faker.internet.userName(body.firstName, body.lastName),
        }

        let pet = {
            name: faker.random.arrayElement(DogName),
            type: "",
            photo: [],
            breed: faker.random.arrayElement(DogBreed),
            secondaryBreed: faker.random.arrayElement(DogBreed),
            age: faker.datatype.number(15),
            sex: faker.random.arrayElement(gender),
            size: faker.datatype.number(),
            bio: faker.lorem.sentences(2)
        }

        db.User.create(body).then(user => {
            console.log(user)
            pet.UserId = user.id
            // db.Pet.create(pet)
        }).catch(error => {
            console.log(error);
        })

    }
}

data()