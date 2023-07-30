import { useRecoilValue, useSetRecoilState } from 'recoil';
import { DeleteState } from '../recoil/atom';
import { modalState } from '../recoil/atom';
import Modal from 'react-modal';

// ...import statements

const DeleteModal = ({ selected, rows, setRows, setSelected }) => {
    const showModal = useRecoilValue(DeleteState);
    const setDeleteState = useSetRecoilState(DeleteState);
    const setModalState = useSetRecoilState(modalState);

    const handleCancelClick = () => {
        setDeleteState(false);
    };

    const handleDeleteClick = async () => {
        setDeleteState(false);
        setModalState(true);

        try {
            await Promise.all(
                selected.map(async (element) => {
                    await fetch(
                        `http://localhost:8082/h2h_milestone_3/DeleteDataServlet?slNo=${element}`,
                        {
                            method: 'POST'
                        }
                    );
                })
            );

            // Filter out the deleted rows and update the state
            const updatedRows = rows.filter((row) =>
                !selected.some((element) => element === row.slNo)
            );
            setRows(updatedRows);

            console.log('Data deleted successfully.');

            // Empty the selected array
            setSelected([]);
        } catch (error) {
            console.error('An error occurred while deleting data:', error);
            // Handle network errors or exceptions
        }

        setModalState(false);
    };
    const modalStyles = {
        overlay: {
            backgroundColor: 'rgba(0, 0, 0, 0.5)' // Set the overlay background color with transparency
        },
        content: {
            background: 'none', // Set the modal content background to none
            border: 'none', // Remove the border
            padding: '0', // Remove padding
            inset: '40px', // Set the position inset
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
        },
    };

    return (
        <Modal isOpen={showModal} ariaHideApp={false} className="Modal" style={modalStyles}>
            <div id="deleteModal" tabIndex="-1" aria-hidden="true" className="fixed inset-0 flex items-center justify-center z-50">
                <div className="relative p-4 w-full max-w-md">
                    <div className="relative p-4 text-center bg-white rounded-lg shadow-sm">
                        <button
                            type="button"
                            className="text-gray-400 absolute top-2.5 right-2.5 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm p-1.5 ml-auto inline-flex items-center dark:hover:bg-gray-600 dark:hover:text-white"
                            data-modal-toggle="deleteModal"
                            onClick={handleCancelClick}
                        >
                            <svg
                                aria-hidden="true"
                                className="w-5 h-5"
                                fill="currentColor"
                                viewBox="0 0 20 20"
                                xmlns="http://www.w3.org/2000/svg"
                            >
                                <path
                                    fillRule="evenodd"
                                    d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                                    clipRule="evenodd"
                                ></path>
                            </svg>
                            <span className="sr-only">Close modal</span>
                        </button>
                        <svg
                            className="text-gray-400 dark:text-gray-500 w-11 h-11 mb-3.5 mx-auto"
                            aria-hidden="true"
                            fill="currentColor"
                            viewBox="0 0 20 20"
                            xmlns="http://www.w3.org/2000/svg"
                        >
                            <path
                                fillRule="evenodd"
                                d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z"
                                clipRule="evenodd"
                            ></path>
                        </svg>
                        <p className="mb-4 text-black">
                            Are you sure you want to delete this Records?
                        </p>
                        <p className="text-sm sm:text-base mb-4">
                            {selected.length} records selected
                        </p>
                        <div className="flex justify-center items-center space-x-4">
                            <button
                                data-modal-toggle="deleteModal"
                                type="button"
                                className="py-2 px-3 text-sm font-medium text-gray-500 bg-white rounded-lg border border-gray-200 hover:bg-gray-100 focus:ring-4 focus:outline-none focus:ring-primary-300 hover:text-gray-900 focus:z-10 dark:bg-gray-700 dark:text-gray-300 dark:border-gray-500 dark:hover:text-white dark:hover:bg-gray-600 dark:focus:ring-gray-600"
                                onClick={handleCancelClick}
                            >
                                No, cancel
                            </button>
                            <button
                                type="submit"
                                className="py-2 px-3 text-sm font-medium text-center text-white bg-red-600 rounded-lg hover:bg-red-700 focus:ring-4 focus:outline-none focus:ring-red-300 dark:bg-red-500 dark:hover:bg-red-600 dark:focus:ring-red-900"
                                onClick={handleDeleteClick}
                            >
                                Yes, Delete
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </Modal>


    );
};

export default DeleteModal;

