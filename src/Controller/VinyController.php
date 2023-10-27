<?php

namespace App\Controller;

use App\Form\SearchTypeForm;
use App\Form\UserSelectTypeFormType;
use App\Repository\DragonTreasureRepository;
use App\Repository\UserRepository;
use App\Service\Service;
use Knp\Component\Pager\PaginatorInterface;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Annotation\Route;
use function Symfony\Component\String\u;

class VinyController extends AbstractController
{

    #[Route('/', name: 'app_homepage')]
    public function index(Request $request,DragonTreasureRepository $dragonTreasureRepository, UserRepository $userRepository,PaginatorInterface $paginator, Service $service): Response
    {
        $session = $request->getSession();
        $defaultSearchName= $session->get('search_name')?:null;
        $defaultUser=$session->get('selected_user')?$userRepository->find($session->get('selected_user')):null;
        $defaultStartDate=$session->get('startDate')?$service->strToDate($session->get('startDate')):null;
        $defaultEnDate=$session->get('endDate')?$service->strToDate($session->get('endDate')):null;

        // Create the search form
        $searchForm=$this->createForm(SearchTypeForm::class,['query'=>$defaultSearchName]);

        $userSelectForm=$this->createForm(UserSelectTypeFormType::class,['user'=>$defaultUser,'startDate'=>$defaultStartDate,'endDate'=>$defaultEnDate]);

        // Handle the form submission
        $searchForm->handleRequest($request);
        $userSelectForm->handleRequest($request);

        // Get the query builder based on the name query parameter

        if($request->query->get('name')){
           $queryBuilder= $dragonTreasureRepository->findByNameLike($request->query->get('name'));
        }elseif ($session->get('search_name')){
            $queryBuilder= $dragonTreasureRepository->findByNameLike($session->get('search_name'));
        }
        elseif ($request->query->get('username') || $request->query->get('startDate') || $request->query->get('endDate')){
            $queryBuilder= $dragonTreasureRepository->findByFilters(
                [
                   'user'=> $request->query->get('username') ?: null,
                   'startDate'=> $request->query->get('startDate') ?$service->strToDate($request->query->get('startDate')): null,
                   'endDate'=> $request->query->get('endDate') ?$service->strToDate($request->query->get('endDate')): null
                ]);
        }elseif ($session->get('selected_user')){
            $queryBuilder= $dragonTreasureRepository->findBy(['owner'=>$session->get('selected_user')]);
        }
        else{
           $queryBuilder= $dragonTreasureRepository->findAllQuery();
        }



        // If the search form is submitted and valid
        if ($searchForm->isSubmitted() && $searchForm->isValid()) {

            if ($session->has('selected_user')) {
                $session->remove('selected_user');
            }
            if ($session->has('startDate')) {
                $session->remove('startDate');
            }
            if ($session->has('endDate')) {
                $session->remove('endDate');
            }

            // Get the query data from the form
            $query = $searchForm->get('query')->getData();

            $session->set('search_name', $query);

            // Redirect to the homepage with the query and page number as parameters
            return $this->redirectToRoute('app_homepage', [
                'name' => $query,
                'page' => 1,
            ]);
        }


        // If the search form is submitted and valid
        if ($userSelectForm->isSubmitted() && $userSelectForm->isValid()) {

            if ($session->has('search_name')) {
                $session->remove('search_name');
            }
            // Get the query data from the form
            $username = $userSelectForm->get('user')->getData()?$userSelectForm->get('user')->getData()->getUsername():null;
            $startDate = $service->dateToStr($userSelectForm->get('startDate')->getData() )?: null;
            $endDate = $service->dateToStr($userSelectForm->get('endDate')->getData()) ?: null;
            $session->set('selected_user', $userSelectForm->get('user')->getData() ?$userSelectForm->get('user')->getData()->getID(): null);
            $session->set('startDate', $startDate);
            $session->set('endDate', $endDate);



            // Redirect to the homepage with the query and page number as parameters
            return $this->redirectToRoute('app_homepage', [
                'username' => $username,
                'startDate' => $startDate,
                'endDate' => $endDate,
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
            'searchForm'=>$searchForm->createView(),
            'userSelectForm'=>$userSelectForm->createView()
        ]);
    }



}
