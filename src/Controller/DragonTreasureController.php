<?php

namespace App\Controller;

use App\Entity\DragonTreasure;
use App\Form\DragonTreasureType;
use App\Form\FilterType;
use App\Repository\DragonTreasureRepository;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Annotation\Route;

#[Route('/dragon')]
class DragonTreasureController extends AbstractController
{

    #[Route('/', name: 'app_dragon_treasure_index', methods: ['GET','POST'])]
    public function index(Request $request,DragonTreasureRepository $dragonTreasureRepository): Response
    {

        $startDate = $request->query->get('startDate');
        $endDate = $request->query->get('endDate');


        $dragonTreasure=[];

        if($startDate && $endDate){

            $s= \DateTime::createFromFormat('Y-m-d H:i',$startDate);
            $e= \DateTime::createFromFormat('Y-m-d H:i',$endDate);


           $dragonTreasure= $dragonTreasureRepository->filterByCreatedAt($s,$e);

        }else{
            $dragonTreasure=$dragonTreasureRepository->findAll();
        }




        return $this->render('dragon_treasure/index.html.twig', [
            'dragon_treasures' => $dragonTreasure,
             'startDate'=> $startDate,
             'endDate'=> $endDate
        ]);
    }

    #[Route('/new', name: 'app_dragon_treasure_new', methods: ['GET', 'POST'])]
    public function new(Request $request, EntityManagerInterface $entityManager): Response
    {
        $dragonTreasure = new DragonTreasure();
        $form = $this->createForm(DragonTreasureType::class, $dragonTreasure);
        $form->handleRequest($request);

        if ($form->isSubmitted() && $form->isValid()) {
            $entityManager->persist($dragonTreasure);
            $entityManager->flush();

            return $this->redirectToRoute('app_dragon_treasure_index', [], Response::HTTP_SEE_OTHER);
        }

        return $this->render('dragon_treasure/new.html.twig', [
            'dragon_treasure' => $dragonTreasure,
            'form' => $form,
        ]);
    }

    #[Route('/{id}', name: 'app_dragon_treasure_show', methods: ['GET'])]
    public function show(DragonTreasure $dragonTreasure): Response
    {
        return $this->render('dragon_treasure/show.html.twig', [
            'dragon_treasure' => $dragonTreasure,
        ]);
    }

    #[Route('/{id}/edit', name: 'app_dragon_treasure_edit', methods: ['GET', 'POST'])]
    public function edit(Request $request, DragonTreasure $dragonTreasure, EntityManagerInterface $entityManager): Response
    {
        $form = $this->createForm(DragonTreasureType::class, $dragonTreasure);
        $form->handleRequest($request);

        if ($form->isSubmitted() && $form->isValid()) {
            $entityManager->flush();

            return $this->redirectToRoute('app_dragon_treasure_index', [], Response::HTTP_SEE_OTHER);
        }

        return $this->render('dragon_treasure/edit.html.twig', [
            'dragon_treasure' => $dragonTreasure,
            'form' => $form,
        ]);
    }


    #[Route('/{id}', name: 'app_dragon_treasure_delete', methods: ['POST'])]
    public function delete(Request $request, DragonTreasure $dragonTreasure, EntityManagerInterface $entityManager): Response
    {
        if ($this->isCsrfTokenValid('delete'.$dragonTreasure->getId(), $request->request->get('_token'))) {
            $entityManager->remove($dragonTreasure);
            $entityManager->flush();
        }

        return $this->redirectToRoute('app_dragon_treasure_index', [], Response::HTTP_SEE_OTHER);
    }
}
