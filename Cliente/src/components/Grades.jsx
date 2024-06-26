import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setGrades } from "state";
import ReactPaginate from "react-paginate";
import Sidebar from "./Sidebar";
import Aside from "./Aside";
import { useNavigate, useParams } from "react-router-dom";
import '../index.css'; 
const Grades = () => {
  const dispatch = useDispatch();
  const grades = useSelector((state) => state.grades);
  const token = useSelector((state) => state.token);
  const [currentPage, setCurrentPage] = useState(0);
  const navigate = useNavigate();
  const { level } = useParams();
  const API_URL = process.env.REACT_APP_API_URL;

  const getGrades = async () => {
    const response = await fetch(`${API_URL}/grades/${level}`,
  
     {
      method: "GET",
      headers: { Authorization: `Bearer ${token}` },
    });
    const data = await response.json();
    dispatch(setGrades({ grades: data }));
  };

  const PER_PAGE = 10;
  const offset = currentPage * PER_PAGE;
  const pageCount = Math.ceil(grades.length / PER_PAGE);

  const handlePageClick = ({ selected: selectedPage }) => {
    setCurrentPage(selectedPage);
  };

  const handleDelete = async (gradeId) => {
    const response = await fetch(`${API_URL}/grades/${gradeId}/delete`, {
      method: "DELETE",
      headers: {Authorization: `Bearer ${token}`, "Content-Type": "application/json",},
    });
    console.log(response);
    console.log("Grade deleted");
    getGrades();
  }

  useEffect(() => {
    getGrades();
  }, [level]); // eslint-disable-line

  const gradesToDisplay = grades
    .slice(offset, offset + PER_PAGE)
    .map((grade) => (
      <tr key={grade._id}>
        <td className="border px-4 py-2">{grade.gradeName}</td>
        <td className="border px-4 py-2">{grade.level}</td>
        <td className="border px-4 py-2">
          <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mr-2" onClick={() => navigate(`/editGrade/${level}/${grade._id}`)}>
            Edit
          </button>
          <button className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded" onClick={() => handleDelete(grade._id)}>
            Delete
          </button>
        </td>
      </tr>
    ));

  return (
   
    <>
   <div className="p-4 sm:ml-64"> 
    <div className="fondoy fondoy-wrap p-5">
     
      <Sidebar />
      <Aside />
   
      <div className="p-4 sm:ml-64">
        <div className=" fondox p-4 border-2 border-gray-200 border-dashed rounded-lg dark:border-gray-700 mt-14 ">
          <div className="flex flex-row justify-between mb-4">
            <h1 className="text-3xl font-bold mb-4  ">Grades</h1>
            <button
              className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded mr-2"
              onClick={() => navigate(`/newGrade/${level}`)}
            >
              New grade
            </button>
          </div>
          <table className=" table-auto">
            <thead>
              <tr>
                <th className="px-4 py-2">Name Grade</th>
                <th className="px-4 py-2">Level</th>
                <th className="px-4 py-2">Actions</th>
              </tr>
            </thead>
            <tbody>{gradesToDisplay}</tbody>
          </table>
          <div className="flex justify-center mt-4">
            <ReactPaginate
            
              previousLabel= {"← Previous"}
              nextLabel={"Next →"}
              pageCount={pageCount}
              onPageChange={handlePageClick}
              containerClassName={"pagination"}
              previousLinkClassName={"previous_page"}
              nextLinkClassName={"next_page"}
              disabledClassName={"pagination__link--disabled"}
              activeClassName={"pagination__link--active"}
            />
          </div>
        </div>
      </div>
      <div/>
      </div></div>
    </>
   
  );
};

export default Grades;
