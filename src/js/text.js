/**
 * Coupe un text et rajoute a la fin de ce text "..." et le renvoi
 * @param   {Number}    length  le nombre de caractère a afficher
 * 
 * @returns {Varchar}   
 */
 let cutText = function(sizeText) {
    let text = this.toString();

    if(this.length >= sizeText){
        text = this.substring(0, sizeText);
        text += '...'; 
    }

    return text;
}

String.prototype.cutText = cutText;