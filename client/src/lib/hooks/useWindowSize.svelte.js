// useWindowSize.svelte.js
export function useWindowSize() {
  let width = $state(0);
  let height = $state(0);

  $effect(() => { // utiliser un effet pour mettre à jour les dimensions de la fenêtre chaque fois que la fenêtre est redimensionnée
    if (typeof window === "undefined") return; 

    const update = () => { 
      width = window.innerWidth;
      height = window.innerHeight;
    };

    update();
    window.addEventListener("resize", update);

    return () => { // retourner une fonction de nettoyage qui supprime l'écouteur d'événement "resize" 
      window.removeEventListener("resize", update);
    };
  });

  return { // retourner un objet contenant les propriétés width et height pour permettre aux composants qui utilisent ce hook d'accéder aux dimensions de la fenêtre
    get width() {
      return width;
    },
    get height() {
      return height;
    },
  };
}
