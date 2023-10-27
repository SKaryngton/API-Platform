<?php

namespace App\Form;

use App\Entity\User;
use Symfony\Bridge\Doctrine\Form\Type\EntityType;
use Symfony\Component\Form\AbstractType;
use Symfony\Component\Form\Extension\Core\Type\DateTimeType;
use Symfony\Component\Form\Extension\Core\Type\SubmitType;
use Symfony\Component\Form\FormBuilderInterface;
use Symfony\Component\OptionsResolver\OptionsResolver;
use Symfony\Component\Validator\Constraints\Callback;
use Symfony\Component\Validator\Constraints\LessThanOrEqual;
use Symfony\Component\Validator\Context\ExecutionContextInterface;


class UserSelectTypeFormType extends AbstractType
{
    public function buildForm(FormBuilderInterface $builder, array $options): void
    {
        $builder
            ->add('user', EntityType::class, [
                'class' => User::class,
                'choice_label' => 'username',
                'label' => false,
                'placeholder' => 'All users',
                'required'=> false
            ])
            ->add('startDate', DateTimeType::class, [
                'widget' => 'single_text',
                'required' => false,
                'attr' => [
                    'min' => (new \DateTime())->modify('-10 years')->format('Y-m-d\TH:i'),
                    'max' => (new \DateTime())->format('Y-m-d\TH:i'),
                ]
            ])
            ->add('endDate', DateTimeType::class, [
                'widget' => 'single_text',
                'required' => false,
                'attr' => [
                    'max' => (new \DateTime())->format('Y-m-d\TH:i'),
                ]
            ])
            ->add('filter', SubmitType::class, [
            'attr' => ['class' => 'btn btn-primary'],
            ]);
    }

    public function configureOptions(OptionsResolver $resolver): void
    {
        $resolver->setDefaults([

        ]);
    }


}
