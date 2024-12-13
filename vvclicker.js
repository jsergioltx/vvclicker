// Função para encontrar um elemento usando XPath
function getElementByXPath(xpath) {
    return document.evaluate(xpath, document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue;
}

// Função que aguarda o elemento aparecer
function waitForElementToBeVisible(selector, callback) {
    const element = document.querySelector(selector);
    if (element) {
        if (element.offsetParent !== null) {
            callback(element);
        } else {
            setTimeout(() => waitForElementToBeVisible(selector, callback), 100);
        }
    } else {
        console.log("Elemento não encontrado.");
    }
}

// Função para aguardar a mudança no texto do elemento
function waitForTextChange(selector, callback) {
    const targetElement = document.querySelector(selector);

    if (!targetElement) {
        console.log("Elemento não encontrado.");
        return;
    }

    const observer = new MutationObserver((mutationsList) => {
        for (let mutation of mutationsList) {
            if (mutation.type === 'childList' || mutation.type === 'characterData') {
                callback(targetElement.innerText);
                observer.disconnect();
            }
        }
    });

    observer.observe(targetElement, { subtree: true, characterData: true, childList: true });
}

// Função para contar elementos tr dentro da tabela
function numeroElementosTR(idTabela) {
    // Selecione a tabela pelo id
    const table = document.getElementById(idTabela);

    // Verifique se a tabela existe
    if (table) {
        // Selecione todos os elementos tr dentro da tabela
        const trElements = table.querySelectorAll("tr");

        // Retorne a contagem de elementos tr
        return trElements.length;
    } else {
        console.log("Tabela não encontrada.");
        return 0;
    }
}



// Encontre o elemento
const targetElementMenuSoap = getElementByXPath("//*[@id='sidebar']/div[1]/div[3]/ul/li[3]");
const targetElementMenuFolhaDeRosto = getElementByXPath("//*[@id='sidebar']/div[1]/div[3]/ul/li[1]");
//const codigoEsp = document.getElementById("lookup_key_pec_atendimento_soap_codespecialidade");
const campoDataAtestado = getElementByXPath("//*[@id='upa_atendimento_atestado_data']");
const campoHoraAtestado = getElementByXPath("//*[@id='upa_atendimento_atestado_hora']");

// Preencher o campo data do atestado com a data e hora de hoje
waitForElementToBeVisible("#upa_atendimento_atestado_data", (upa_atendimento_atestado_data) => {
    
    // Função para formatar a data no formato dd/mm/aaaa
    function obterDataAtual() {
        const data = new Date();
        const dia = String(data.getDate()).padStart(2, '0');
        const mes = String(data.getMonth() + 1).padStart(2, '0'); // Meses são indexados a partir de 0
        const ano = data.getFullYear();
        return `${dia}/${mes}/${ano}`;
    }


    // Obtendo a data atual formatada
    const dataAtualFormatada = obterDataAtual();

    if (upa_atendimento_atestado_data.value !== dataAtualFormatada) {
        setTimeout(() => {
            upa_atendimento_atestado_data.focus();
            upa_atendimento_atestado_data.value = dataAtualFormatada;
            console.log(`Valor ${dataAtualFormatada} digitado no campo.`);
        }, 100);
    }

    waitForElementToBeVisible("#upa_atendimento_atestado_hora", (upa_atendimento_atestado_hora) => {
        
        // Função para formatar a hora no formato hh:mm
        function obterHoraAtual() {
            const data = new Date();
            const horas = String(data.getHours()).padStart(2, '0');
            const minutos = String(data.getMinutes()).padStart(2, '0');
            return `${horas}:${minutos}`;
        }

        const horaAtualFormatada = obterHoraAtual();

        if (upa_atendimento_atestado_hora.value !== horaAtualFormatada) {
            setTimeout(() => {
                upa_atendimento_atestado_hora.focus();
                upa_atendimento_atestado_hora.value = horaAtualFormatada;
                console.log(`Valor ${horaAtualFormatada} digitado no campo.`);
            }, 100);
        }
    });
});  

if(targetElementMenuFolhaDeRosto && targetElementMenuFolhaDeRosto.classList.contains('active')){
    // Se estiver na tela de atendimento da UPA já preenche o campo finalização com o código 10
    // Aguardar aparecer o elemento codigoFinalizacao e preencher com 10
    waitForElementToBeVisible("#lookup_key_upa_atendimento_id_motivofinalizacao", (codigoFinalizacao) => {
        if(codigoFinalizacao){
            //codigoFinalizacao.focus();
            if (codigoFinalizacao && codigoFinalizacao.value !== "10") {
                setTimeout(() => {
                    codigoFinalizacao.focus();
                    codigoFinalizacao.value = "10"
                    console.log("Valor 10 digitado no campo.");
                }, 100);
            }
        }
    });  
    // Aguardar aparecer o elemento hmaTextArea e adiciona a ele o auto size
    waitForElementToBeVisible("#upa_atendimento_amb_anamnese_deshma", (hmaTextArea) => {
        if(hmaTextArea){
            if (hmaTextArea) {
                setTimeout(() => {
                    //hmaTextArea.classList.add('fwk-textarea-auto-size');
                    hmaTextArea.style.height = '300px';
                    console.log("Adicionado auto size a hmaTextArea");
                }, 100);
            }
        }
    });  
}

if (targetElementMenuSoap) {
    // Crie um MutationObserver
    const observer = new MutationObserver((mutationsList) => {
        for (let mutation of mutationsList) {
            if (mutation.type === 'attributes' && mutation.attributeName === 'class') {
                console.log('Classe alterada:', targetElementMenuSoap.className);
                // Verifique se a classe 'active' foi adicionada
                if (targetElementMenuSoap.classList.contains('active')) {
                    console.log('A classe "active" foi adicionada ao item menu soap');

                    // Aguardar aparecer o elemento codigoEsp e preencher com 225142 - tambem adiciona o botao chamar paciente
                    waitForElementToBeVisible("#lookup_key_pec_atendimento_soap_codespecialidade", (codigoEsp) => {
                        if(codigoEsp){
                            //codigoEsp.focus();
                            if (codigoEsp && codigoEsp.value !== "225142") {
                                setTimeout(() => {
                                    codigoEsp.focus();
                                    codigoEsp.value = "225142"
                                    console.log("Valor 225142 digitado no campo.");
                                }, 100);
                            }
                        }

                        // Localiza o elementoTitulo pelo xPath
                        //const elementoTitulo = document.querySelector(".box-title");
                        const elementoTitulo = getElementByXPath("//*[@id='pec_atendimento_soap_dados_atend']/div[1]/div[1]")
                
                        if (elementoTitulo) {
                                // Obtém o novo valor do registro_id a partir da função
                               // let filaRecepcaoId = new URLSearchParams(window.location.search).get('pec_atendimento_soap%5Bfila_recepcao_id%5D');
                            let filaRecepcaoId = new URLSearchParams(window.location.search).get('pec_atendimento_soap[fila_recepcao_id]');
                            console.log(window.location.search);
                            console.log(window.location.href);
  

                                /*if (filaRecepcaoId) {
                                    console.log("fila_recepcao_id extraído:", filaRecepcaoId);
                                
                                    // Cria o HTML atualizado com o novo registro_id
                                    const novoHtml = `
                                        <i class="fas fa-list-alt"></i> Dados do atendimento 
                                        <div class="btn btn-default pec-atendimento-btn-chamada">
                                            <i data-title="Chamar usuário" 
                                               data-toggle="tooltip" 
                                               data-container="body" 
                                               style="color:black;" 
                                               adm_operador_id="1841" 
                                               registro_id="${filaRecepcaoId}" 
                                               nompaciente="Jose Carlos Manoel Dos Santos" 
                                               numprontuario="4194" 
                                               class="fas fa-volume-up fa-lg" 
                                               data-original-title="" 
                                               title="">
                                            </i>
                                        </div>
                                    `;
                                }
                            else{
                                console.error("filaRecepcaoId não encontrado. tente aqui:");
                            }*/
                            
                                
                        } else {
                            console.error("elementoTitulo com a classe 'box-title' não encontrado.");
                        }
                    });  
                    

                    // Aguardar aparecer o elemento campoCid e preencher com Z00
                    waitForElementToBeVisible("#lookup_key_pec_atendimento_soap_avaliacao_cid", (campoCodigoCid) => {
                        // Se ja tiver CID inserido nao fazer nada
                        if (numeroElementosTR("pec_atendimento_soap_avaliacao_cid_table") == 1) {
                            campoCodigoCid.focus();
                            setTimeout(() => {
                                campoCodigoCid.value = "Z00";
                                console.log("Valor 'Z00' digitado no campo.");
                            }, 100);

                            const campoAvaliacao = document.getElementById("pec_atendimento_soap_avaliacao");
                            setTimeout(() => {
                                campoAvaliacao.click();
                                campoAvaliacao.focus();
                            }, 100);
                        }
                        else {
                            console.log("Ja tem cid adicionado, nao adicionar mais")
                        }
                    });

                    // Aguarda aparecer a descrição do CID e clica no botão de +
                    botaoAdicionarCid = document.getElementById("pec_atendimento_soap_avaliacao_add_fields_button");
                    waitForTextChange("#select2-chosen-9", (innerText) => {
                        // Se ja tiver CID inserido nao fazer nada
                        if (numeroElementosTR("pec_atendimento_soap_avaliacao_cid_table") == 1) {
                            console.log("Descrição CID alterado para:", innerText);
                            botaoAdicionarCid.focus();
                            setTimeout(() => {
                                botaoAdicionarCid.click();
                                console.log("Valor 'Z00' digitado no campo.");
                            }, 100);

                            const campoAvaliacao = document.getElementById("pec_atendimento_soap_avaliacao");
                            setTimeout(() => {
                                campoAvaliacao.click();
                                campoAvaliacao.focus();
                                // Até aqui funcionou

                                // Ideia para continuar = daqui mesmo já clicar no campo finalizar atendimento [mas fazer outra lógica para ele ficar observando]
                                // Falta também fazer a mesma lógica para mudar o CBO
                            }, 100);
                        }
                        else {
                            console.log("Ja tem cid adicionado, nao adicionar mais")
                        }
                    });

                } else {
                    console.log('A classe "active" foi removida do item menu soap');
                }
            }
        }
    });

    // Configuração do observer: observar mudanças nos atributos
    const config = { attributes: true };

    // Inicie o observer no elemento alvo
    observer.observe(targetElementMenuSoap, config);

    console.log('Observando mudanças na classe do item menu soap');
} else {
    console.log('Elemento do item menu soap não encontrado para o XPath fornecido.');
}








// Encontre o elemento
const targetElementMenuFinalizar = getElementByXPath("//*[@id='sidebar']/div[1]/div[3]/ul/li[13]"); // Menu finalizar atendimento

if (targetElementMenuFinalizar) {
    // Crie um MutationObserver
    const observer = new MutationObserver((mutationsList) => {
        for (let mutation of mutationsList) {
            if (mutation.type === 'attributes' && mutation.attributeName === 'class') {
                console.log('Classe alterada:', targetElementMenuFinalizar.className);
                // Verifique se a classe 'active' foi adicionada
                if (targetElementMenuFinalizar.classList.contains('active')) {
                    console.log('A classe "active" foi adicionada ao item menu finalizar atendimento');

                    // Aguardar aparecer o elemento codProcedimento e preencher com 0301010064
                    ////*[@id="lookup_key_pec_atendimento_soap_esu_tipo_atendimento_id"]
                    const tipoAtendimento = document.getElementById("lookup_key_pec_atendimento_soap_esu_tipo_atendimento_id");

                    
                    waitForElementToBeVisible("#lookup_key_pec_atendimento_soap_finalizacao_procedimento", (codProcedimento) => {
                        // Se ja tiver Procedimento inserido nao fazer nada
                        if (numeroElementosTR("pec_atendimento_soap_procedimentos_finalizacao_table") == 1) {
                            codProcedimento.focus();
                            setTimeout(() => {
                                codProcedimento.value = "0301010064";
                                console.log("Valor '0301010064' digitado no campo.");
                            }, 100);

                            
                            // Clica fora do campo só para carregar a descrição do procedimento
                            setTimeout(() => {
                                tipoAtendimento.click();
                                tipoAtendimento.focus();
                            }, 200);


                        }
                        else {
                            console.log("Ja tem Procedimento adicionado, nao adicionar mais")
                        }
                    });

                    // Aguarda aparecer a descrição do procedimento e clica no botão de +
                    const botaoAdicionarProced = document.getElementById("pec_atendimento_soap_procedimentos_finalizacao_button");
                    let procedimentoAdicionado = false; // Flag para verificar se o procedimento já foi adicionado

                    waitForTextChange("#select2-chosen-23", async (innerText) => {
                        console.log("Número de elementos TR antes de adicionar:", numeroElementosTR("pec_atendimento_soap_procedimentos_finalizacao_table"));
                        if (!procedimentoAdicionado && numeroElementosTR("pec_atendimento_soap_procedimentos_finalizacao_table") == 1) {
                            console.log("Descrição Procedimento alterado para:", innerText);
                            procedimentoAdicionado = true; // Marca que o procedimento foi adicionado
                    
                            // Se ja tiver Procedimento inserido nao fazer nada
                            try {
                                // Aguarda 1 segundo e clica no botão
                                await new Promise(resolve => setTimeout(resolve, 100));
                                botaoAdicionarProced.click();
                                console.log("botão adicionar procedimento clicado");
                    
                                // Aguarda mais 1 segundo e atualiza o tipo de atendimento
                                await new Promise(resolve => setTimeout(resolve, 100));
                                tipoAtendimento.click();
                                tipoAtendimento.focus();
                                tipoAtendimento.value = "5";
                    
                                // Aguarda mais 1 segundo e clica no próximo campo
                                await new Promise(resolve => setTimeout(resolve, 100));
                                document.getElementById("lookup_key_pec_atendimento_soap_profissional_adicional").focus();
                                console.log("clicou em outro campo");

                                // Aguarda mais 1 segundo e clica no soap
                                await new Promise(resolve => setTimeout(resolve, 100));
                                targetElementMenuSoap.focus();
                                targetElementMenuSoap.click();
                                console.log("clicou no soap");

                        
                                // Aguarda mais 1 segundo e clica no campo avaliacao
                                await new Promise(resolve => setTimeout(resolve, 100));
                                document.getElementById("pec_atendimento_soap_avaliacao").focus();
                                console.log("clicou no campo avaliacao");
                            } catch (error) {
                                console.error("Erro durante a adição do procedimento:", error);
                            }
                        }

                        /*
                        if (numeroElementosTR("pec_atendimento_soap_procedimentos_finalizacao_table") == 1) {
                            console.log("Descrição Procedimento alterado para:", innerText);
                            //botaoAdicionarProced.focus();
                            setTimeout(() => {
                                botaoAdicionarProced.click();
                                console.log("botao add procedimento clicado");
                            }, 1000);

                            setTimeout(() => {
                                tipoAtendimento.click();
                                tipoAtendimento.focus();
                                tipoAtendimento.value = "5";
                            }, 2000);

                            setTimeout(() => { //<input type="text" name="lookup_key[pec_atendimento_soap[profissional_adicional]]" id="lookup_key_pec_atendimento_soap_profissional_adicional" value="" class="form-control lookup-edit-key wmObject wmSearch wmSearchResult wmInsert wmEdit fwk-lookup-edit-v3" data-toggle="tooltip" data-placement="top" data-title="Profissional" data-original-title="" title="" data-bs.tooltip="[object Object]">
                                //document.getElementById("lookup_key_pec_atendimento_soap_profissional_adicional").focus();
                                document.getElementById("lookup_key_pec_atendimento_soap_profissional_adicional").click();
                                console.log("clicou em outro campo");
                            }, 3000);
                            
                        }
                        else {
                            console.log("Ja tem Procedimento adicionado, nao adicionar mais");
                        }*/
                    });

                    //document.getElementById("lookup_key_pec_atendimento_soap_esu_tipo_atendimento_id"). value = "5"; // Tipoatendimento
                    document.getElementById("pec_atendimento_soap_esu_conduta_ids_7").checked = true; // Checkbox retorno programado  condinuado


                } else {
                    console.log('A classe "active" foi removida do item menu finalizar atendimento');
                }
            }
        }
    });

    // Configuração do observer: observar mudanças nos atributos
    const config = { attributes: true };

    // Inicie o observer no elemento alvo
    observer.observe(targetElementMenuFinalizar, config);

    console.log('Observando mudanças na classe do item menu finalizar atendimento');
} else {
    console.log('Elemento do item menu soap não encontrado para o XPath fornecido.');
}
