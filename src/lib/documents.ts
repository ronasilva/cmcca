// Display metadata for the Esfera Intelectual documents stored under
// documents/ in the student-media bucket. Files not listed here fall
// back to a name derived from the filename.
export const DOCUMENT_META: Record<string, { title: string; author: string }> =
  {
    "01-artigo-sobre-mestre-pastinha.pdf": {
      title: "Artigo sobre Mestre Pastinha",
      author: "Paulo Magalhães",
    },
    "02-manuscritos-do-mestre-pastinha.pdf": {
      title: "Manuscritos do Mestre Pastinha",
      author: "Vicente Ferreira Pastinha",
    },
    "03-capoeira-angola-mestre-pastinha.pdf": {
      title: "Capoeira Angola",
      author: "Mestre Pastinha",
    },
    "04-capoeira-angola-waldeloir-rego.pdf": {
      title: "Capoeira Angola — ensaio sócio-etnográfico",
      author: "Waldeloir Rego",
    },
    "05-a-negregada-instituicao.pdf": {
      title: "A Negregada Instituição — os capoeiras no Rio de Janeiro",
      author: "Carlos Eugênio Líbano Soares",
    },
  };

export function documentThumbPath(pdfName: string): string {
  return `document-thumbs/${pdfName.replace(/\.pdf$/i, ".jpg")}`;
}
