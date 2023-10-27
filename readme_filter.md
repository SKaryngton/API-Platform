- ###  Symfony Table

- ### retrieve all
```

 #[Route('/', name: 'app_homepage')]
    public function index( UserRepository $userRepository): Response
    {
      
        $users= $userRepository->findAll();

        return $this->render('vinyl/homepage.html.twig', [
         
            'users'=> $users
        ]);
    }
    
 
 vinyl/homepage.html.twig   
  <!-- Dropdown for selecting user -->
        <div class="mb-3">
            <label for="userSelect" class="form-label">Select a user:</label>
            <select class="form-select" id="userSelect">
                {% for user in users %}
                    <option value="{{ user.id }}">{{ user.username }}</option>
                {% endfor %}
            </select>
        </div>   

```
- ### Paginator
```
- composer require knplabs/knp-paginator-bundle

- Repository
   public function findAllQuery(): Query
        {
        return $this->createQueryBuilder('d')
            ->getQuery()

        ;
    }

- Controller

 #[Route('/', name: 'app_homepage')]
    public function index(Request $request,DragonTreasureRepository $dragonTreasureRepository,PaginatorInterface $paginator): Response
    {
        $dragonTreasures = $paginator->paginate(
            $dragonTreasureRepository->findAllQuery(),/* query NOT result */ accepte aussi des tableau $data = [['name' => 'Alice', 'age' => 25],// ...];
            $request->query->getInt('page',1), /*page number*/
            10  /*limit per page*/

        );
      

        return $this->render('vinyl/homepage.html.twig', [
            'dragonTreasures' => $dragonTreasures,
       
        ]);
    }

-Template
 <table class="table table-bordered">
            <thead>
            <tr>
                <th scope="col">ID</th>
                <th scope="col">Name</th>
                <th scope="col">Description</th>
                <th scope="col">Value</th>
                <th scope="col">CFactor</th>
                <th scope="col">Owner</th>
            </tr>
            </thead>
            <tbody>
            {% for dragonTreasure in dragonTreasures %}
                <tr>
                    <th scope="row">{{ dragonTreasure.id }}</th>
                    <td>{{ dragonTreasure.name }}</td>
                    <td>{{ dragonTreasure.description | length >30 ? dragonTreasure.description|slice(0, 30) ~ '...' : dragonTreasure.description }}</td>
                    <td>{{ dragonTreasure.value }}</td>
                    <td>{{ dragonTreasure.coolFactor }}</td>
                    <td>{{ dragonTreasure.owner.username }}</td>
                </tr>
            {% endfor %}
            </tbody>
        </table>
        {{ knp_pagination_render(dragonTreasures) }}    
        
        
  -Yaml
  # config/packages/knp_paginator.yaml
    knp_paginator:
        template:
            pagination: '@KnpPaginator/Pagination/bootstrap_v4_pagination.html.twig'
            sortable: '@KnpPaginator/Pagination/sortable_link.html.twig'      
```

- ### Paginator Tri par defaut controller
```
  public function findAllQuery(): Query
        {
        return $this->createQueryBuilder('d')
            ->getQuery()

        ;
    }
    
 #[Route('/', name: 'app_homepage')]
    public function index(Request $request,DragonTreasureRepository $dragonTreasureRepository,PaginatorInterface $paginator): Response
    {
        $sort = $request->query->get('sort', 'd.id');
        $direction = $request->query->get('direction', 'asc');

        $dragonTreasures = $paginator->paginate(
            $dragonTreasureRepository->findAllQuery(),/* query NOT result */
            $request->query->getInt('page',1), /*page number*/
            10,  /*limit per page*/
            [
                'defaultSortFieldName' => $sort,
                'defaultSortDirection' => $direction,
            ]

        );
        $users= $userRepository->findAll();

        return $this->render('vinyl/homepage.html.twig', [
            'dragonTreasures' => $dragonTreasures
        ]);
    }
```
- ### paginator tri template
```
public function findAllQuery(): Query
        {
        return $this->createQueryBuilder('d')
            ->getQuery()

        ;
    }
    
 #[Route('/', name: 'app_homepage')]
    public function index(Request $request,DragonTreasureRepository $dragonTreasureRepository, UserRepository $userRepository,PaginatorInterface $paginator): Response
    {


        $dragonTreasures = $paginator->paginate(
            $dragonTreasureRepository->findAllQuery(),/* query NOT result */
            $request->query->getInt('page',1), /*page number*/
            10  /*limit per page*/


        );
        $users= $userRepository->findAll();

        return $this->render('vinyl/homepage.html.twig', [
            'dragonTreasures' => $dragonTreasures,
            'users'=> $users
        ]);


 <thead>
            <tr>
                <th scope="col">{{ knp_pagination_sortable(dragonTreasures, 'ID', 'd.id') }}</th>
                <th scope="col">{{ knp_pagination_sortable(dragonTreasures, 'Name', 'd.name') }}</th>
                <th scope="col">Description</th>
                <th scope="col">Value</th>
                <th scope="col">CFactor</th>
                <th scope="col">Owner</th>
            </tr>
  </thead>
```
- ### paginator Filter by Name
```

- Form
class SearchTypeForm extends AbstractType
{
    public function buildForm(FormBuilderInterface $builder, array $options): void
    {
        $builder
            ->add('query', TextType::class, [
                'required' => false,
                'label' => 'Search',
                'attr' => ['placeholder' => 'Search by name...'],
            ])
        ;
    }

    public function configureOptions(OptionsResolver $resolver): void
    {
        $resolver->setDefaults([
            // Configure your form options here
        ]);
    }
}

-Controller
 #[Route('/', name: 'app_homepage')]
    public function index(Request $request,DragonTreasureRepository $dragonTreasureRepository, UserRepository $userRepository,PaginatorInterface $paginator): Response
    {

        // Create the search form
        $searchForm=$this->createForm(SearchTypeForm::class);

        // Handle the form submission
        $searchForm->handleRequest($request);

        // Get the query builder based on the name query parameter
        $queryBuilder= $request->query->get('name')? $dragonTreasureRepository->findByNameLike($request->query->get('name')):$dragonTreasureRepository->findAllQuery();

        // If the search form is submitted and valid
        if ($searchForm->isSubmitted() && $searchForm->isValid()) {

            // Get the query data from the form
            $query = $searchForm->get('query')->getData();
            // Redirect to the homepage with the query and page number as parameters
            return $this->redirectToRoute('app_homepage', [
                'name' => $query,
                'page' => 1,
            ]);
        }

        // Paginate the results
        $dragonTreasures = $paginator->paginate(
          $queryBuilder,/* query NOT result */
            $request->query->getInt('page',1), /*page number*/
            10  /*limit per page*/


        );
        //Get all users
        $users= $userRepository->findAll();

        // Render the homepage template
        return $this->render('vinyl/homepage.html.twig', [
            'dragonTreasures' => $dragonTreasures,
            'users'=> $users,
            'searchForm'=>$searchForm->createView()
        ]);
    }
}

-Template
 <div class="mb-3">
            {{ form_start(searchForm, {'attr': {'class': 'd-flex justify-content-between'}}) }}
            {{ form_row(searchForm.query) }}
            <button type="submit" class="btn btn-primary ">Search</button>
            {{ form_end(searchForm) }}
        </div>

```
