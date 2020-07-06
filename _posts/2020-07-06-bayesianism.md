---
layout: post
title: Le billard de Bayes
---

J'ai rencontré le théorème de Bayes grâce à [Lê de la chaine YouTube Science4All](https://www.youtube.com/channel/UC0NCbj8CxzeCGIF6sODJ-7A/). Un des premiers exemples d'application de ce théorème était __"le billard de Bayes"__ qui a été défini par Thomas Bayes lui-même.

Le problème est le suivant : 
>Une personne (le "divinateur") tourne le dos à une table de billard. Une assistant va placer aléatoirement une première bille rouge sur la table. L'objectif du divinateur va être de prédire la position de la bille rouge. L'assistant va ensuite placer une à une des billes blanches de manière aléatoire sur la table et pour chaque bille blanche indiquer au divinateur si la nouvelle bille est à droite ou à gauche de la bille rouge.

Si cette explication n'est pas très parlante vous pouvez jeter un oeil à [cette vidéo où Matt Parker et Hannah Fry](
https://www.youtube.com/watch?v=7GgLSnQ48os) reprodusient l'expérience.

De mon côté j'ai reproduit ce problème sous [Google Colab](https://colab.research.google.com/drive/1I01no4m2KQTBD9Lb0AJOQMzj3vR5_LkA?usp=sharing). Le principe est assez simple, je tire au hasard une position de départ pour la bille rouge puis je simule des tirages aléatoires des billes blanches et je met à jour les probabilités de trouver la bille rouge à chaque point de la table.

Avant d'avoir posé une bille blanche toutes les positions de la bille rouge sont aussi probables les unes que les autres, ce qu'on voit sur l'image ci-dessous :

![No prior]({{ site.baseurl }}/images/billard/noprior.png "No prior")

Le trait vert indique la position de la bille rouge mais cette information n'est pas prise en compte pour calculer les probabilités.

On va ensuite tirer une bille blanche au hasard et mettre à jour les probabilités. Dans mon exemple on a tiré une bille blanche _"à gauche"_ de la bille rouge. Il est donc peu probable que la bille rouge soit sur la gauche de la table et plus probable que la bille rouge soit à droite de la table. Si on prend les cas extrêmes il est impossible que la bille rouge soit en 0 puisque aucune bille ne pourrait être à gauche de celle-ci. Il est également très peu probable qu'elle soit en position 1, puisqu'il n'y a qu'une seule position à gauche de la position 1.

![1 test]({{ site.baseurl }}/images/billard/1test.png "1 test")


En pratique on utilise la formule de Bayes : 

![Formula]({{ site.baseurl }}/images/billard/formula.png "Bayes Formula")

C'est un peu barbare comme ça mais en pratique ça se comprend assez bien. C'est principalement une manière de retourner une probabilité condistionnelle. Par exemple je sais que lorsqu'il pleut, 95% du temps j'ai mon parapluie. J'aimerais savoir la probabilité qu'il pleuve sachant que j'ai pris mon parapluie. ça n'est pas 95%, il y a certainement des jours où je prend mon parapluie et où il ne pleut pas.

Pour revenir à notre problème de billard, ce qui nous intéresse c'est de savoir la probabilité que la bille rouge soit à la position _X_ sachant que la bille blanche est à gauche (ou à droite) de la bille rouge. Si on remplace _A_ par _position = X_ et _B_ par _gauche_ dans la formule de Bayes on obtient :

![Updated Formula]({{ site.baseurl }}/images/billard/updatedFormula.png "Upudated Formula")

On peut ensuite appliquer cette formule à chaque position _X_. Par exemple dans le cas _X_=20, la probabilité que la bille rouge soit en _X_=20 sachant qu'on a eu l'information _gauche_ sera égale à :
 - la probabilité d'avoir l'information _gauche_ sachant qu'on est en position _X_=20 soit 20 chances sur 100 
 - multiplié par la probabilité d'être en position _X_=20, c'est à dire l'ancienne probabilité qu'on est en train de mettre à jour (au premier tour ce sera donc 1/100 puis on reprendra la dernière valeur obtenu à chaque fois)
 - divisé par la probabilité d'obtenir l'information _gauche_. Cette partie est ignorée dans mon google collab puisque sans autre information cette probabilité est de 1/2 tout comme la probabilité d'obtenir un _droite_. 

 Ainsi si on applique cette formule à de nombreux essais on obtiendra une prédiction de la position de la boule rouge de plus en plus fiable :

![2 tests]({{ site.baseurl }}/images/billard/2tests.png "2 tests")

![20 tests]({{ site.baseurl }}/images/billard/20tests.png "20 tests")

Après une vingtaine de tests on voit que la bille rouge est probablement entre 40 et 80.

![100 tests]({{ site.baseurl }}/images/billard/100tests.png "100 tests")

Après cents tests a réduit l'intervalle à quelque chose comme 55 - 75.

![1000 tests]({{ site.baseurl }}/images/billard/1000tests.png "1000 tests")

Après 1000 tests, on s'approche encore d'un interval 65 - 70.

Voilà pour cet exemple d'utilisation de la formule de Bayes. Je sais que ce genre d'algorithme permet de faire du machine learning et je vais me pencher dessus bientôt. 
