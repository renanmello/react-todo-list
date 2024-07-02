import React, { useState, useEffect } from "react";
import './TodoList.css';
import Icone from './assets/icon.webp'
import jsPDF from "jspdf";

function TodoList() {
    const listaStorage = localStorage.getItem('Lista');
    const [lista, setLista] = useState(listaStorage ? JSON.parse(listaStorage) : []);
    const [novoItem, setNovoItem] = useState("");

    useEffect(() => {
        localStorage.setItem('Lista', JSON.stringify(lista));
    }, [lista])

    function gerarPDF(lista) {
        //var doc = new jsPDF();
        //var pageHeight = doc.internal.pageSize.height || doc.internal.pageSize.getHeight();
        //var pageWidth = doc.internal.pageSize.width || doc.internal.pageSize.getWidth();


        // FOOTER
        //let str = "Your footer text";
        //doc.setTextColor(100);
        //doc.setFontSize(10);
        //doc.text(str, pageWidth / 2, pageHeight  - 10, {align: 'center'});
        //doc.save("example.pdf");        

        // Cria um novo documento PDF com o tamanho desejado
        var doc = new jsPDF("p", "mm", "a4");
        var pageHeight = doc.internal.pageSize.height || doc.internal.pageSize.getHeight();
        var pageWidth = doc.internal.pageSize.width || doc.internal.pageSize.getWidth();
        // Insere o HTML da página atual no documento PDF
        //doc.html(document.body);
        doc.setFont("Arial");
        const listaAux = [...lista];
        doc.text("<| Lista de Tarefas | To-do List |>\n", pageWidth / 2, 10, { align: 'center' })
        let linha = 10;

        for (let x = 0; x < listaAux.length; x++) {
            if (x % 2) {
                doc.setTextColor(100);
            } else {
                doc.setTextColor(1);
            }
            doc.text(String(x + 1) + ". " + listaAux[x]['text'], pageWidth / 2, linha += 10, { align: 'center' })
        }

        //doc.text(listaAux[0]['text'],pageWidth / 2, 20 ,{align: 'center'})
        //doc.text(listaAux[1]['text'], pageWidth / 2, 30 ,{align: 'center'})
        // Salva o documento PDF com o nome desejado
        doc.save("meu-pdf.pdf");
    }

    function adicionaItem(form) {
        form.preventDefault();
        if (!novoItem) {
            return;
        }
        setLista([...lista, { text: novoItem, isCompleted: false }]);
        setNovoItem("");
        document.getElementById('input').focus();
    }

    function clicou(index) {
        const listaAux = [...lista];
        listaAux[index].isCompleted = !listaAux[index].isCompleted;
        setLista(listaAux);
    }

    function deleta(index) {
        const listaAux = [...lista];
        listaAux.splice(index, 1);
        setLista(listaAux);
    }

    function deletaTudo() {
        setLista([]);
    }


    return (
        <div>
            <h1>Lista de Tarefas | to-do list</h1>

            <form onSubmit={adicionaItem}>
                <input
                    id="input"
                    type="text"
                    value={novoItem}
                    onChange={(e) => { setNovoItem(e.target.value) }}
                    placeholder="Adicione uma tarefa | Add a task"
                />
                <button className="add" type="submit">Add</button>
            </form>
            <div className="listaTarefas">
                <div style={{ textAlign: 'center' }}>
                    {
                        lista.length < 1
                            ?
                            <img className="icone-central" src={Icone} />
                            :
                            lista.map((item, index) => (
                                <div
                                    key={index}
                                    className={item.isCompleted ? "item completo" : "item"}
                                >
                                    <span onClick={() => { clicou(index) }}>{item.text}</span>
                                    <button onClick={() => { deleta(index) }} className="del">Deletar - Delete</button>
                                </div>
                            ))

                    }
                    {
                        lista.length > 0 &&
                        <button onClick={() => { deletaTudo() }} className="deleteAll">Deletar Todas - Delete All</button>

                    }
                    {
                        lista.length > 0 &&
                        <button onClick={() => { gerarPDF(lista) }} className="pdfprint">Imprimir Lista - Print</button>

                    }

                </div>
            </div>
        </div>
    )
}

export default TodoList