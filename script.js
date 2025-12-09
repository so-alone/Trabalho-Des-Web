// ------------------------
// LocalStorage Functions
// ------------------------

function carregarTarefas() {
    return JSON.parse(localStorage.getItem("tarefas")) || [];
}

function salvarTarefas(tarefas) {
    localStorage.setItem("tarefas", JSON.stringify(tarefas));
}

function gerarId() {
    return Date.now();
}

// ------------------------
// Renderização
// ------------------------
function renderizar() {
    const listas = {
        todo: document.getElementById("todo"),
        doing: document.getElementById("doing"),
        done: document.getElementById("done")
    };

    Object.values(listas).forEach(l => l.innerHTML = "");

    const tarefas = carregarTarefas();

    tarefas.forEach(tarefa => {
        const div = document.createElement("div");
        div.classList.add("tarefa");
        div.dataset.id = tarefa.id;

        div.innerHTML = `
            <div class="tarefa-header">
                <strong>${tarefa.titulo}</strong>
                <span class="prioridade ${tarefa.prioridade}">${tarefa.prioridade}</span>
            </div>

            <p>${tarefa.descricao || ""}</p>
            <small>Vencimento: ${tarefa.vencimento || "-"}</small>

            <label class="label-status">Estado:</label>
            <select class="select-status" data-id="${tarefa.id}">
                <option value="todo" ${tarefa.status === "todo" ? "selected" : ""}>A Fazer</option>
                <option value="doing" ${tarefa.status === "doing" ? "selected" : ""}>Em Progresso</option>
                <option value="done" ${tarefa.status === "done" ? "selected" : ""}>Concluído</option>
            </select>

            <div class="actions">
                <button onclick="editarTarefa(${tarefa.id})">✏️</button>
                <button onclick="excluirTarefa(${tarefa.id})">🗑️</button>
            </div>
        `;

        listas[tarefa.status].appendChild(div);
    });

    // Alteração de status direto no card
    document.querySelectorAll(".select-status").forEach(select => {
        select.addEventListener("change", e => {
            const id = e.target.dataset.id;
            const novoStatus = e.target.value;

            const tarefas = carregarTarefas();
            const t = tarefas.find(tsk => tsk.id == id);

            t.status = novoStatus;

            salvarTarefas(tarefas);
            renderizar();
        });
    });
}

// ------------------------
// CRUD
// ------------------------
function excluirTarefa(id) {
    const tarefas = carregarTarefas().filter(t => t.id !== id);
    salvarTarefas(tarefas);
    renderizar();
}

function editarTarefa(id) {
    const tarefa = carregarTarefas().find(t => t.id === id);

    document.getElementById("modal").style.display = "flex";
    document.getElementById("modalTitulo").textContent = "Editar Tarefa";

    document.getElementById("taskId").value = tarefa.id;
    document.getElementById("titulo").value = tarefa.titulo;
    document.getElementById("descricao").value = tarefa.descricao;
    document.getElementById("prioridade").value = tarefa.prioridade;
    document.getElementById("vencimento").value = tarefa.vencimento;
}

// ------------------------
// Modal
// ------------------------
const modal = document.getElementById("modal");

document.getElementById("btnNovaTarefa").onclick = () => {
    document.getElementById("formTarefa").reset();
    document.getElementById("modalTitulo").textContent = "Nova Tarefa";
    document.getElementById("taskId").value = "";
    modal.style.display = "flex";
};

document.getElementById("fecharModal").onclick = () =>
    modal.style.display = "none";

document.getElementById("formTarefa").onsubmit = e => {
    e.preventDefault();

    const id = document.getElementById("taskId").value;
    const titulo = document.getElementById("titulo").value.trim();
    const descricao = document.getElementById("descricao").value.trim();
    const prioridade = document.getElementById("prioridade").value;
    const vencimento = document.getElementById("vencimento").value;

    if (!titulo) {
        alert("O título é obrigatório.");
        return;
    }

    const tarefas = carregarTarefas();

    if (id) {
        // Edição
        const t = tarefas.find(t => t.id == id);
        t.titulo = titulo;
        t.descricao = descricao;
        t.prioridade = prioridade;
        t.vencimento = vencimento;

    } else {
        // CRIAÇÃO SEM STATUS → sempre "A Fazer"
        tarefas.push({
            id: gerarId(),
            titulo,
            descricao,
            prioridade,
            vencimento,
            status: "todo"
        });
    }

    salvarTarefas(tarefas);
    modal.style.display = "none";
    renderizar();
};

// ------------------------
renderizar();
