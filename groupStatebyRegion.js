const groupStatebyRegion = {
  northeast: [
    'Connecticut',
    'Maine',
    'Massachusetts',
    'New Hampshire',
    'Rhode Island',
    'Vermont',
    'New Jersey',
    'New York',
    'Pennsylvania',
  ],
  midwest: [
    'Illinois',
    'Indiana',
    'Michigan',
    'Ohio',
    'Wisconsin',
    'Iowa',
    'Kansas',
    'Minnesota',
    'Missouri',
    'Nebraska',
    'North Dakota',
    'South Dakota',
  ],
  south: [
    'Delaware',
    'Florida',
    'Georgia',
    'Maryland',
    'North Carolina',
    'South Carolina',
    'Virginia',
    'District of Columbia',
    'West Virginia',
    'Alabama',
    'Kentucky',
    'Mississippi',
    'Tennessee',
    'Arkansas',
    'Louisiana',
    'Oklahoma',
    'Texas',
  ],
  west: [
    'Arizona',
    'Colorado',
    'Idaho',
    'Montana',
    'Nevada',
    'New Mexico',
    'Utah',
    'Wyoming',
    'Alaska',
    'California',
    'Hawaii',
    'Oregon',
    'Washington',
  ],
};

function getRegion(state) {
  for (let region in groupStatebyRegion) {
    if (groupStatebyRegion[region].includes(state)) return region;
  }
  return false;
}
