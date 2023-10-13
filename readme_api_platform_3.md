
# [API-Platform 3](https://api-platform.com)

## Technische Anforderungen / Technical Requirements/Pre-requis techniques
- ### install/installiere
    - Api-platform
       ```
       composer require api
      
      go to  https://localhost/api
      
      enable docker 
      
       ```
- ###  Creating ApiResource  / erstellen ApiResource

    ```
     -create an Entity
           - install maker
            composer require maker --dev
  
           - create an entity 
            symfony console  make:entity
  
     - connect a Database with docker
  
       run   docker-compose up -d
              php bin/console make:migration 
              php bin/console doctrine:migrations:migrate
  
     - connect a Sqlite DB  
  
            php bin/console doctrine:database:create  
            php bin/console make:migration 
            php bin/console doctrine:migrations:migrate
  
     - Add the attribute  #[ApiResource] above the class Entity
   ```
  
- ### Human readable Datetime (ago)
```
   - intall nesbot/carbon
   
    composer require nesbot/carbon
    
   
```
- ### fake data Factory

```
   composer require foundry orm-fixtures --dev
    php bin/console make:factory
     symfony console doctrine:fixtures:load 
```

- ### add ShortName and description
```
#[ApiResource(
    shortName: 'Treasure',
    description: 'A rare and valuable treasure.'
    )

```
- ### add Operations

```
operations: [
        new Get(uriTemplate: '/dragon-plunders/{id}'),
       new GetCollection('/dragon-plunders/'),
        new Post(),
        new Put(),
        new Patch(),
        new Delete()
    ]
```
- ### choose fields who can be read and/or write with Groups

```
#[ApiResource(
    normalizationContext: [
        'groups'=>['treasure:read']
    ],
    denormalizationContext: [
        'groups'=>['treasure:write']
    ]
)]


  #[ORM\Column(length: 255)]
    #[Groups(['treasure:read','treasure:write'])]
    #[Assert\NotBlank]
    private ?string $description = null;
```
- ### Pagination

```
#[ApiResource(
    paginationItemsPerPage: 10
)]
```

- ### add HAL and CSV format
```
config/packages/api_platform.yaml

api_platform:
    formats:
        jsonld: [ 'application/ld+json' ]
        json: [ 'application/json' ]
        html: [ 'text/html' ]
        jsonhal: [ 'application/hal+json' ]
        csv: ['text/csv']



#[ApiResource(
formats: [
        'jsonld'=>'application/ld+json',
        'json'=>'application/json',
        'html'=>'text/html',
        'jsonhal'=>'application/hal+json',
        'csv' => 'text/csv',
    ]
 )]
    
php/bin console cache:clear
```

- ### Filter
```

//Allow you to select wchich field you want
#[ApiFilter(PropertyFilter::class)]
class DragonTreasure{}


 #[ApiFilter(BooleanFilter::class)]
 private ?bool $isPublished = null;
 
  #[ApiFilter(RangeFilter::class)]
  private ?int $value = null;
  
  #[ApiFilter(SearchFilter::class, strategy: 'partial')] //start , exact
  private ?string $name = null;
  
```
- ### Filter related Object

```
User Entity


#[ApiFilter(SearchFilter::class, strategy: 'exact')] //start , partial
private Collection $dragonTreasures;

DragonTreasure Entity

#[ApiFilter(SearchFilter::class, properties: ['owner.username'=>'partial'])]
class DragonTreasure
{}


```

- ### add validator
```
use Symfony\Component\Validator\Constraints as Assert;

    #[Assert\NotBlank]
    #[Assert\Length(min: 2, max: 50, maxMessage: 'Describe your loot in 50 chars or less')]
    private ?string $name = null;
    
     #[Assert\GreaterThanOrEqual(0)]
     private ?int $value = null;
     
      #[Assert\GreaterThanOrEqual(0)]
      #[Assert\LessThanOrEqual(10)]
      private ?int $coolFactor = null;
      
      
#[UniqueEntity(fields: ['email'], message: 'There is already an account with this email')]
#[UniqueEntity(fields: ['username'], message: 'It looks like another dragon took your username. ROAR!')]
class User implements UserInterface, PasswordAuthenticatedUserInterface
{}


#[Assert\NotBlank]
#[Assert\Email]
private ?string $email = null;
```
- ### validation of  related Object

```
  class DragonTreasure
{
    #[ORM\ManyToOne(inversedBy: 'dragonTreasures')]
    #[ORM\JoinColumn(nullable: false)]
    #[Groups(['treasure:read','treasure:write'])]
    #[Assert\Valid]
    private ?User $owner = null;
}

```
- ### show Owner detail in DragonTreasure just by Getting single element
```
Treasure Entity

operations: [
        new Get(
        normalizationContext: ['groups'=>['treasure:read','treasure:item:get']]
        )]


User Entity

 #[ORM\Column(length: 255, unique: true)]
    #[Groups(['treasure:item:get'])]
    #[Assert\NotBlank]
    private ?string $username = null;
```

- ### update related object , update Owner of a Treasure(OneToMany User->DragonTreasure)

```
DragonTreasure Entity
#[ApiResource(
 denormalizationContext: [
        'groups'=>['treasure:write']
    ]
)

    
User Entity

  #[ORM\Column(length: 255, unique: true)]
    #[Groups(['treasure:write'])]
    #[Assert\NotBlank]
    private ?string $username = null;
    
    
    Put operation
    
    {
  
  "owner": {
      "@id":"/api/users/3"   //you need to add the IRI for using an existing Object
       "username":"updated value"
}
}

```
- ### Create a new Owner object by Updating DragonTreasure
```
DragonTreasure Entity
#[ApiResource(
 denormalizationContext: [
        'groups'=>['treasure:write']
    ]
)
#[Groups(['treasure:read','treasure:write'])]
#[Assert\Valid]     // don't forget the validator
private ?User $owner = null;
    
User Entity

  #[ORM\Column(length: 255, unique: true)]
    #[Groups(['treasure:write'])]
    #[Assert\NotBlank]
    private ?string $username = null;
    
    
    Put operation  API UI
    
    {
  "name": "hh",
  "owner": {
      //just don't add the IRI and add all required fields
       "username":"updated value",
       "email":"ss@gmail.com"
       
}
}

```
- ### Create new user and add existing dragonTreasure

```
User Entity

#[ORM\OneToMany(mappedBy: 'owner', targetEntity: DragonTreasure::class)]
    #[Groups(['user:write'])]
    private Collection $dragonTreasures;
    
    
Post Request

{
"email": "och.pascale@gmail.com",
"username": "caleSorcerer141",
"password": "string",
"dragonTreasures":[
  "/api/dragon-plunders/6",
   "/api/dragon-plunders/7"
]  
}
```

- ### Create new user and add new dragonTreasure
```
User Entity
#[ORM\OneToMany(cascade:['persist'])] // add to persist the Object
    #[Groups(['user:read','user:write'])]
    #[Assert\Valid]
    private Collection $dragonTreasures;
    
    
DragonTreasure Entity

 #[ORM\Column(length: 255)]
    #[Groups(['user:write'])]
    private ?string $name = null;

    #[Groups(['user:write'])]
    private ?string $description = null;

    #[Groups(['user:write'])]
    private ?int $value = null;
    
    #[Groups(['user:write'])]
    private ?int $coolFactor = null;

    #[Groups(['user:write'])]
    private ?bool $isPublished = null;
    
    
    POST REQUEST
    
{
"email": "bisco.pascale@gmail.com",
"username": "bisco141",
"password": "string",
"dragonTreasures":[
 
              {
              "name": "Shin Sekai",
              "description": "new world",
              "value": 10000,
              "coolFactor":3,
              "isPublished":true
            
              }
] 
}

```

- ### Update by adding DragonTreasure of an existing User

```
PATCH REQUEST


{
  "dragonTreasures":[
  "/api/dragon-plunders/41",
  "/api/dragon-plunders/8",
]

}

```
- ### Update by removing DragonTreasure of an existing User
```
PATCH REQUEST


{
  "dragonTreasures":[
  "/api/dragon-plunders/41"
]

}

normalise you should become this error:
An exception occurred while executing a query: SQLSTATE[23000]: Integrity constraint
violation: 19 NOT NULL constraint failed: dragon_treasure.owner_id"

because /api/dragon-plunders/8 is still existing in the database but 
his Owner was set to null

SOLUTION

User Entity

  #[ORM\OneToMany(orphanRemoval: true)]
  private Collection $dragonTreasures;
  

this tell to Doctrine if any DragonTreasure become Orphan , that means no longer
have  any Owner they schould be deleted


```
- ### SubResources  Best way to obtain treasure collections of a specific User

```

DragonTreasure  Entity

#[ApiResource(
    uriTemplate: '/users/{user_id}/treasures.{_format}',
    shortName: 'Treasure',
    operations: [new GetCollection()],
    uriVariables: [
        'user_id'=> new Link(
 // use toProperty: 'owner' if there is no dragonTreasures propertie by User 
            fromProperty: 'dragonTreasures', 
            fromClass: User::class
        )
    ],
    normalizationContext: [
        'groups'=>['treasure:read']
    ],
)]

User Entity

#[ApiResource(
    uriTemplate: '/treasures/{treasure_id}/owner.{_format}',
    operations: [new Get()],
    uriVariables: [
        'treasure_id' => new Link(
            fromProperty: 'owner',
            fromClass: DragonTreasure::class,
        ),
    ],
    normalizationContext: ['groups' => ['user:read']],
)]

```

- ### Api-platform React-Admin

```
   - npm install @api-platform/admin -D
   
   - composer require symfony/ux-react
   
   - npm install react -D
   
   - assets/react/controllers/ReactAdmin.jsx
   
   import { HydraAdmin } from "@api-platform/admin";
   import React from 'react';


    export default (props) => (
    <HydraAdmin entrypoint={props.entrypoint} />
     );
     
    - src/Controller/ApiAdminController.php
    
     class ApiAdminController extends  AbstractController
    {

        #[Route('/admin')]
        public function dashboard(): Response
        {
            return $this->render('admin/dashboard.html.twig');
        }
     }
     
    - templates/admin/dashboard.html.twig
    
      {% extends 'base.html.twig' %}
        {% block body %}
            <div {{ react_component('ReactAdmin', {
                entrypoint: path('api_entrypoint')
            }) }}></div>
        {% endblock %} 
     
```
