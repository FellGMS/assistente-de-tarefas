// fgg_Lista de Tarefas
// Desenvolvido por Fellipe Goulart Gomes

document.addEventListener('DOMContentLoaded', () => {
    // Seleciona os elementos do DOM
    const fgg_taskForm = document.getElementById('fgg-task-form');
    const fgg_taskInput = document.getElementById('fgg-task-input');
    const fgg_taskDesc = document.getElementById('fgg-task-desc');
    const fgg_taskDate = document.getElementById('fgg-task-date');
    const fgg_taskTime = document.getElementById('fgg-task-time');
    const fgg_taskList = document.getElementById('fgg-task-list');
    const fgg_alarmSound = document.getElementById('fgg-alarm-sound');
    const fgg_bellSound = document.getElementById('fgg-bell-sound');
    const fgg_recurringAlarm = document.getElementById('fgg-recurring-alarm');
    const fgg_modal = document.getElementById('task-modal');
    const fgg_detailsModal = document.getElementById('details-modal');
    const fgg_closeModal = document.querySelectorAll('.close');
    const fgg_addTaskBtn = document.getElementById('add-task-btn');
    const fgg_editTaskButton = document.getElementById('edit-task');
    const fgg_completeTaskButton = document.getElementById('complete-task');
    let currentTaskElement;

    // Função para abrir o modal
    const fgg_openModal = (modal) => {
        modal.style.display = 'block';
    };

    // Função para fechar o modal
    fgg_closeModal.forEach(close => {
        close.addEventListener('click', () => {
            fgg_modal.style.display = 'none';
            fgg_detailsModal.style.display = 'none';
        });
    });

    // Função para adicionar tarefa
    const fgg_addTask = (taskText, taskDesc, taskDueDate, taskTime, isRecurring) => {
        const listItem = document.createElement('li');
        const taskContent = document.createElement('span');
        taskContent.textContent = `${taskText} (Até: ${taskDueDate} ${taskTime})`;
        taskContent.dataset.desc = taskDesc;

        const deleteButton = document.createElement('button');
        deleteButton.textContent = 'Excluir';
        deleteButton.addEventListener('click', () => {
            clearInterval(listItem.alarmInterval);
            fgg_taskList.removeChild(listItem);
        });

        listItem.appendChild(taskContent);
        listItem.appendChild(deleteButton);
        fgg_taskList.appendChild(listItem);

        fgg_setAlarm(listItem, taskText, taskDesc, taskDueDate, taskTime, isRecurring);
    };

    // Função para configurar alarmes
    const fgg_setAlarm = (taskElement, taskText, taskDesc, taskDueDate, taskTime, isRecurring) => {
        const alarmDateTime = new Date(`${taskDueDate}T${taskTime}`);

        const checkAlarm = () => {
            const currentTime = new Date();
            if (currentTime >= alarmDateTime && currentTime <= new Date(alarmDateTime.getTime() + 60000)) { // 1 minuto após o alarme
                taskElement.classList.add('fgg-alert');
                fgg_bellSound.play();
                setTimeout(() => {
                    responsiveVoice.speak(`Você tem uma tarefa agendada para agora: ${taskText}. ${taskDesc}`, 'Brazilian Portuguese Female');
                }, 2000); // Espera 2 segundos para tocar a campainha antes da narração

                if (!isRecurring) {
                    clearInterval(taskElement.alarmInterval);
                }
            } else {
                taskElement.classList.remove('fgg-alert');
            }
        };

        checkAlarm();
        taskElement.alarmInterval = setInterval(checkAlarm, 60000); // Verificar a cada minuto
    };

    // Manipulação do envio do formulário
    fgg_taskForm.addEventListener('submit', (e) => {
        e.preventDefault();

        const taskText = fgg_taskInput.value.trim();
        const taskDesc = fgg_taskDesc.value.trim();
        const taskDueDate = fgg_taskDate.value;
        const taskTime = fgg_taskTime.value || '00:00';
        const isRecurring = fgg_recurringAlarm.checked;

        if (taskText !== '' && taskDueDate !== '') {
            fgg_addTask(taskText, taskDesc, taskDueDate, taskTime, isRecurring);
            fgg_taskInput.value = '';
            fgg_taskDesc.value = '';
            fgg_taskDate.value = '';
            fgg_taskTime.value = '';
            fgg_recurringAlarm.checked = false;
            fgg_modal.style.display = 'none';
        }
    });

    // Manipulação de clique para adicionar tarefa
    fgg_addTaskBtn.addEventListener('click', () => {
        document.getElementById('modal-title').textContent = 'Adicionar Nova Tarefa';
        fgg_taskInput.value = '';
        fgg_taskDesc.value = '';
        fgg_taskDate.value = '';
        fgg_taskTime.value = '';
        fgg_recurringAlarm.checked = false;
        fgg_openModal(fgg_modal);
    });

    // Manipulação de clique para exibir detalhes da tarefa
    fgg_taskList.addEventListener('click', (e) => {
        if (e.target.tagName === 'LI' || e.target.tagName === 'SPAN') {
            const taskElement = e.target.tagName === 'LI' ? e.target : e.target.parentNode;
            const taskContent = taskElement.querySelector('span').textContent;
            const [taskText, taskDueDateTime] = taskContent.split(' (Até: ');
            const [taskDueDate, taskTime] = taskDueDateTime.replace(')', '').split(' ');

            currentTaskElement = taskElement;
            document.getElementById('modal-task-title').textContent = taskText;
            document.getElementById('modal-task-desc').textContent = taskElement.querySelector('span').dataset.desc;
            document.getElementById('modal-task-date').textContent = taskDueDate;
            document.getElementById('modal-task-time').textContent = taskTime;
            fgg_openModal(fgg_detailsModal);
        }
    });

    // Função para editar tarefa
    fgg_editTaskButton.addEventListener('click', () => {
        fgg_detailsModal.style.display = 'none';
        document.getElementById('modal-title').textContent = 'Editar Tarefa';
        fgg_taskInput.value = currentTaskElement.querySelector('span').textContent.split(' (Até: ')[0];
        fgg_taskDesc.value = currentTaskElement.querySelector('span').dataset.desc;
        fgg_taskDate.value = currentTaskElement.querySelector('span').textContent.split(' (Até: ')[1].split(' ')[0];
        fgg_taskTime.value = currentTaskElement.querySelector('span').textContent.split(' (Até: ')[1].split(' ')[1].replace(')', '');
        fgg_openModal(fgg_modal);
    });

    // Função para marcar tarefa como realizada
    fgg_completeTaskButton.addEventListener('click', () => {
        currentTaskElement.classList.add('fgg-completed');
        fgg_detailsModal.style.display = 'none';
    });
});
