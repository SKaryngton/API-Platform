﻿<style>
green { color: #299660}
yel { color: #9ea647}
blue { color: #099fc0}
red {color: #ce4141}
</style>
# [<green>Symfony6](https://symfony.com)

## <green>Technische Anforderungen / Technical Requirements/Pre-requis techniques
- ### <yel>install/installiere
    - PHP  and PHP-extensions/erweiterungen/extensions
    - Composer
    - Symfony CLI
    - PHPStorm and Plugins Symfony Support
    - open the console terminal and run this command/ Öffne ihr Konsoleterminal und führe diesen Befehl aus
       ```
       symfony check:requirements
       ```
- ###  Creating Symfony Application  / erstellen von Symfony-Anwendungen

    ```
        #web app
         symfony new my_project_directory --version="" --webapp

         # microservice or API
         symfony new my_project_directory --version=""
   ```

- ###  Running Symfony Application  / Ausführen von Symfony-Anwendungen

  ```
       symfony server:start
       symfony server -d
  ```

- ###  Create your First Page in Symfony   / Erstellen Sie Ihre erste Seite in Symfony

   - Creating a new page is a two-step process/Das Erstellen einer neue Seite  ist ein zweistufiger Prozess
  ```
       -Create a controller:PHP function you write that builds the page
        Erstellen Sie einen Controller:PHP-Funktion, die die Seite erstellt
  
       -Create a route: the URL to your Page and Points to a controller
        Erstellen Sie eine Route: Die URL zu hrer Seite und verweist auf einen Controller
  
  
    class VinyController
   {

    #[Route('/')]
    public function homepage(){

        return new Response('Title:PB and Jams');
    }

   }
      
  ```
- ### Optional wildcard
 ```
    #[Route('/browse/{slug <\d+>}')]
    public function browse(string $slug=null){

        $title = u(str_replace('-', ' ', $slug))->title(true);
        return new Response('Genre: '.$title);
    }
 ```
- ###  Create Twig Template using Flex aliases
    - install Twig
  ```
    composer require templates
  
   Flex replace templates with  symfony/twig-pack and unpacking Pack
   The recipe systeme add all configurations files
  
  
  
  
  class VinyController extends AbstractController
  {

    #[Route('/')]
    public function homepage():Response{

        return $this->render('vinyl/homepage.html.twig',[
            'title'=> 'homepage'
        ]);
    }
  }
  
  VinyController must extends AbstractController to allow you to use  the render methode
  to retrieve the template
  
   #vinyl/homepage.html.twig
  
   {% extends 'base.html.twig' %}
   {% block title %}{{ title }}{% endblock %}


    {% block body %}{% endblock %}

  ```
- ###  retrieve an array in Twig 
  
 ```
  class VinyController extends AbstractController
  {

    #[Route('/')]
    public function homepage():Response{

      $tracks = [
            ['song' => 'Gangsta\'s Paradise', 'artist' => 'Coolio'],
            ['song' => 'Waterfalls', 'artist' => 'TLC'],
            ['song' => 'Creep', 'artist' => 'Radiohead'],
            ['song' => 'Kiss from a Rose', 'artist' => 'Seal'],
            ['song' => 'On Bended Knee', 'artist' => 'Boyz II Men'],
            ['song' => 'Fantasy', 'artist' => 'Mariah Carey'],
        ];
        return $this->render('vinyl/homepage.html.twig',[
            'title'=> 'homepage',
            'tracks'=> $tracks
        ]);
    }
  }
  
  VinyController must extends AbstractController to allow you to use  the render methode
  to retrieve the template
  
   #vinyl/homepage.html.twig
  
   {% extends 'base.html.twig' %}
   {% block title %}{{ title }}{% endblock %}


    % block body %}
    <ul>
        {% for track in tracks %}
            <li>
                {{ track.song }} - {{ track.artist | upper }}
            </li>
        {% endfor %}
    </ul>

{% endblock %}

  ```
- ###  Web Profiler  (Toolbar)

```
  composer require debug
```
- ###  asset : access to the public directory

```
  composer require symfony/asset
  
 # base.html.twig
  
 <!DOCTYPE html>
<html>
    <head>
        <meta charset="UTF-8">
        <title>{% block title %}Welcome{% endblock %}</title>
       <link rel="stylesheet" href="{{ asset('m_v.css') }}">
    </head>
    <body>
        {% block body %}{% endblock %}
    </body>
</html>


 #vinyl/homepage.html.twig
 
{% extends 'base.html.twig' %}
{% block title %}{{ title }}{% endblock %}


{% block body %}
    <img width="50" height="50" src="{{ asset('BluRayDiscBack.png') }}">
    <ul>
        {% for track in tracks %}
            <li>
                {{ track.song }} - {{ track.artist | upper }}
            </li>
        {% endfor %}
    </ul>

{% endblock %}
```
- ###  Generating a URL from Twig

```

class VinylController extends AbstractController
{
    #[Route('/browse/{slug}', name: 'app_browse')]
    public function browse(string $slug = null): Response
    {
    }
}



{% block body %}
    <ul class="genre-list ps-0 mt-2 mb-3">
        <li class="d-inline">
            <a class="btn btn-primary btn-sm" href="{{ path('app_browse', {
                slug: 'pop'
            }) }}">Pop</a>
        </li>
        <li class="d-inline"></li>
        <li class="d-inline"></li>
    </ul>
{% endblock %}

```

- ###  Write css and Javascript using Webpack Encore

```
composer require symfony/webpack-encore-bundle

yarn install
yarn watch
```
- ### Add bootstrap to Webpack Encore
```
  - install Bootstrap
  yarn add bootstrap
  
  _ Import Bootstrap Styles in your css(assets/styles/app.css)
  @import "~bootstrap/dist/css/bootstrap.css";
  
  -base.html.twig
  
   {% block stylesheets %}
            {{ encore_entry_link_tags('app') }}
        {% endblock %}

        {% block javascripts %}
            {{ encore_entry_script_tags('app') }}
        {% endblock %}

```

- ### Add fontawesome and fontsource to Webpack Encore


```
yarn add @fontsource/roboto-condensed --dev
yarn add @fortawesome/fontawesome-free --dev


@import '~@fortawesome/fontawesome-free';
@import '~@fontsource/roboto-condensed';
```
- ### Add javascript with Stimulus 

```
-composer require symfony/stimulus-bundle

-yarn install
-yarn watch


-create assets/controllers/hello_controller
import { Controller } from '@hotwired/stimulus';


export default class extends Controller {
    connect() {
        this.element.textContent = 'Hello Stimulus! Edit me in assets/controllers/hello_controller.js';
    }
}


-attach to an element 

{% block body %}
   

    <div data-controller="hello"></div>
    
   

{% endblock %}


```
- ### Add an click-event with Stimulus 

```
import { Controller } from '@hotwired/stimulus';


export default class extends Controller {

    play(event){
        event.preventDefault();
        console.log('playing!');
    }
}

#homepage.html.twig
{% block body %}
    
    <ul {{ stimulus_controller('hello') }}>
        {% for track in tracks %}
            <li>
               <a {{ stimulus_action('hello','play')}}>{{ track.song }} - {{ track.artist | upper }}</a>
            </li>
        {% endfor %}
    </ul>

{% endblock %}

```

- ### Axios with Stimulus 

```
-yarn add axios --dev

import { Controller } from '@hotwired/stimulus';
import axios from 'axios';

export default class extends Controller {

    static values = {
        infoUrl: String
    }

    play(event){
        event.preventDefault();

        event.preventDefault();
        axios.get(this.infoUrlValue)
            .then((response) => {
                console.log(response);
            });
    }
}



{% block body %}
  

    <ul {{ stimulus_controller('hello') }}>
        {% for track in tracks %}
            <li {{ stimulus_controller('song-controls', {
               infoUrl: path('api_songs_get_one', { id: loop.index }) })}
            >
               {{ track.song }} - {{ track.artist | upper }}
               
            </li>
        {% endfor %}
    </ul>

{% endblock %}

```
- ### Add turbo to transform every click into ajax request and make the app look like a single Page app

```
- composer require symfony/ux-turbo

yarn install
yarn watch
```
