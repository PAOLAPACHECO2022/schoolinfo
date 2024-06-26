import { useEffect, useState, useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setScores } from "state";
import ReactPaginate from "react-paginate";
import Sidebar from "./Sidebar";
import Aside from "./Aside";
import { useNavigate, useParams } from "react-router-dom";
import '../index.css'; 

const ScoresByCourse = () => {
  const dispatch = useDispatch();
  const scores = useSelector((state) => state.scores);
  const token = useSelector((state) => state.token);
  const [currentPage, setCurrentPage] = useState(0);
  const navigate = useNavigate();
  const { courseId, gradeId } = useParams();

  const [searchTerm, setSearchTerm] = useState(""); 

  const getScores = useCallback(async () => {
    const response = await fetch(
      `https://schoolinfo.com/scores/${courseId}/course`, // Cambia esta línea
      {
        method: "GET",
        headers: { Authorization: `Bearer ${token}` },
      }
    );
    const data = await response.json();
    dispatch(setScores({ scores: data }));
  }, [courseId, token, dispatch]);

  useEffect(() => {
    getScores();
  }, [getScores]);

  const PER_PAGE = 10;
  const offset = currentPage * PER_PAGE;
  const pageCount = Math.ceil(scores.length / PER_PAGE);

  const handlePageClick = ({ selected: selectedPage }) => {
    setCurrentPage(selectedPage);
  };

  const handleDelete = async (scoreId) => {
    const response = await fetch(
      `https://schoolinfo.com/scores/${scoreId}/delete`, // Cambia esta línea
      {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      }
    );
    console.log(response);
    console.log("Score deleted");
    getScores();
  };

  const filteredScores = scores.filter((score) =>
    score.studentName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const scoresToDisplay = filteredScores
    .slice(offset, offset + PER_PAGE)
    .map((score) => (
      <tr key={score._id}>
        <td className="border px-4 py-2">{score.studentName}</td>
        <td className="border px-4 py-2">{score.courseName}</td>
        <td className="border px-4 py-2">{score.area}</td>
        <td className="border px-4 py-2">{score.score1}</td>
        <td className="border px-4 py-2">{score.score2}</td>
        <td className="border px-4 py-2">{score.score3}</td>
        <td className="border px-4 py-2">{score.score4}</td>
        <td className="border px-4 py-2">{score.promedio}</td>
        <td className="border px-4 py-2">
          <button
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mr-2 mb-2 sm:mb-0"
            onClick={() => navigate(`/editScore/${courseId}/${gradeId}/${score._id}`)}
          >
            Edit
          </button>
          <button
            className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded"
            onClick={() => handleDelete(score._id)}
          >
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
            <div className="bg-white p-4 border-2 border-gray-200 border-dashed rounded-lg dark:border-gray-700 mt-14">
              <h1 className="text-3xl font-bold mb-4">Scores</h1>
              <div className="flex flex-col sm:flex-row mb-4">
                <input
                  type="text"
                  placeholder="Search by student name..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="border px-4 py-2 rounded mb-2 sm:mr-2"
                />
                <button
                  className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded"
                  onClick={() => navigate(`/newScore/${courseId}/${gradeId}`)}
                >
                  New Score
                </button>
              </div>
              <div className="overflow-x-auto">
                <table className="table-auto w-full text-left">
                  <thead>
                    <tr>
                      <th className="px-4 py-2">Student Name</th>
                      <th className="px-4 py-2">Course Name</th>
                      <th className="px-4 py-2">Area</th>
                      <th className="px-4 py-2">Score 1</th>
                      <th className="px-4 py-2">Score 2</th>
                      <th className="px-4 py-2">Score 3</th>
                      <th className="px-4 py-2">Score 4</th>
                      <th className="px-4 py-2">Promedio</th>
                      <th className="px-4 py-2">Actions</th>
                    </tr>
                  </thead>
                  <tbody>{scoresToDisplay}</tbody>
                </table>
              </div>
              <div className="flex justify-center mt-4">
                <ReactPaginate
                  previousLabel={"← Previous"}
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
        </div>
      </div>
    </>
  );
};

export default ScoresByCourse;
