<?php

namespace App\Form;

use Symfony\Component\Form\AbstractType;
use Symfony\Component\Form\Extension\Core\Type\DateTimeType;
use Symfony\Component\Form\Extension\Core\Type\DateType;
use Symfony\Component\Form\FormBuilderInterface;
use Symfony\Component\OptionsResolver\OptionsResolver;

class FilterType extends AbstractType
{
    public function buildForm(FormBuilderInterface $builder, array $options): void
    {
        $defaultDate = new \DateTime();
        $defaultStartDate=$defaultDate->modify('-30 day');

        $builder
            ->add('startAt', DateTimeType::class, [
                'label' => 'Start Date',
                'widget' => 'single_text',
                'required' => true,
                'data'=> $defaultStartDate,
                'attr' => [
                    'data-controller' => 'date',
                    'data-date-target' => 'input',
                    'data-date-target' => 'date.time',
                    'data-action' => 'change->date#handleDateChange'
                ]

            ])
            ->add('endAt', DateTimeType::class, [
                'label' => 'Ende Date',
                'widget' => 'single_text', // pour avoir un champ unique
                'required' => true
            ]);
    }

    public function configureOptions(OptionsResolver $resolver): void
    {
        $resolver->setDefaults([
            // Configure your form options here
        ]);
    }
}
