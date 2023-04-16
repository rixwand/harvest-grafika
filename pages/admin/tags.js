import Layout from "../../components/admin/layout";
import { withAuth } from "../../components/HOC/Auth";
import {
  IoAddCircleOutline,
  IoCheckbox,
  IoCheckmarkCircleOutline,
  IoCheckmarkOutline,
  IoClose,
  IoCreateOutline,
  IoDuplicateOutline,
  IoFilter,
  IoSkullOutline,
  IoTrash,
  IoTrashBin,
  IoTrashBinOutline,
} from "react-icons/io5";
import { useEffect, useState } from "react";
import axios from "axios";
import cookies from "next-cookies";
import { getAllCkbx } from "../../components/admin/utils";

export const getServerSideProps = withAuth(async (ctx) => {
  const { token } = cookies(ctx);
  const result = await fetch("http://localhost:3000/api/tags", {
    method: "get",
  });
  const tags = await result.json();
  return { props: { tags, token } };
});

const Tags = ({ tags = [], token }) => {
  const [data, setData] = useState([]);
  const [field, setField] = useState("");
  const [showInput, setShowInput] = useState(false);
  const [isCheck, setIsCheck] = useState(false);

  useEffect(() => {
    const newTags = tags.map((tag) => ({ edit: false, ...tag }));
    setData(newTags);
  }, []);
  const submitHandler = async (e) => {
    if (!field) return alert("Please type tag");
    try {
      const { data: newData } = await axios.post(
        "/api/tags/create",
        {
          tag: field,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setField("");
      setShowInput(false);

      setData([...data, { ...newData, edit: false }]);
    } catch (err) {
      if (err.response.data.code == "ER_DUP_ENTRY") {
        alert("Tag sudah ada");
      }
    }
  };

  const saveEdit = async ({ id, name }) => {
    try {
      if (name == field) {
        const editedTags = data.map((tag) =>
          tag.id == id ? { ...tag, edit: false } : tag
        );
        setField("");
        return setData(editedTags);
      }
      const { data: newTag } = await axios.put(
        "/api/tags/update/" + id,
        {
          tag: field,
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setField("");
      const editedTags = data.map((tag) =>
        tag.id == id ? { ...newTag, edit: false } : tag
      );
      setData(editedTags);
    } catch (err) {
      if (err.response.data.code == "ER_DUP_ENTRY") {
        alert("Tag sudah ada");
      }
    }
  };

  const deleteFunc = (id, name) => {
    return new Promise(async (resolve, reject) => {
      try {
        await axios.delete("/api/tags/delete/" + id, {
          headers: { Authorization: `Bearer ${token}` },
        });
        resolve({ id, name });
      } catch (err) {
        reject({ id, name });
      }
    });
  };

  const deleteTag = async (id) => {
    try {
      await axios.delete("/api/tags/delete/" + id, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const editedTags = data.filter((tag) => tag.id != id);
      setData(editedTags);
    } catch (err) {
      console.log(err);
      if (err.response.data == "ER_ROW_IS_REFERENCED_2")
        alert("Tidak dapat menghapus tags yang sedang digunakan");
    }
  };

  const setEdit = (id) => {
    const editTags = data.map((tag) =>
      tag.id == id ? { ...tag, edit: !tag.edit } : tag
    );
    setData(editTags);
  };
  const search = async (e) => {
    const keyword = e.target.value.trim();
    if (keyword) {
      const { data: result } = await axios.get("/api/tags?search=" + keyword);
      setData(result);
    } else {
      setData(tags);
    }
  };
  const deleteMultiple = async () => {
    const { items } = getAllCkbx("tag");
    if (items.length == 0) {
      return alert("select tags");
    }
    if (!confirm("delete selected tags ?")) return;
    try {
      const promise = items.map((item) => {
        return deleteFunc(item.id, item.name);
      });
      const statuses = await Promise.allSettled(promise);
      console.log(statuses);
      const fullField = [];
      const rejected = [];
      statuses.map((prom) =>
        prom.status == "fulfilled"
          ? fullField.push(prom.value.id)
          : rejected.push(prom.reason.name)
      );
      const newTags = [];
      data.map((tag) => !fullField.includes(`${tag.id}`) && newTags.push(tag));
      setData(newTags);
      if (rejected.length > 0)
        return alert(
          `tidak dapat menghapus tags "${rejected.map(
            (name) => " " + name
          )}" karena sedang digunakan`
        );
    } catch (err) {
      alert("Ups!!! something error :(");
    }
  };

  const ckbxChange = () => {
    const checked = getAllCkbx("tag").checked;
    if (checked.includes(false)) setIsCheck(false);
    else setIsCheck(true);
  };

  const fieldHandler = (e) => {
    setField(e.target.value);
  };
  return (
    <Layout title="Tags">
      <h1 className=" text-2xl font-semibold text-solid-slate font-sourceSans">
        Tags Produk
      </h1>
      <div className="flex flex-col md:w-2/5 w-full">
        <div className="menu flex flex-col items-start w-full gap-4 mt-8">
          <div className="search-menu w-full flex justify-start">
            <input
              onChange={search}
              type="search"
              name="searchTags"
              id="searchTags"
              placeholder="Search for tag"
              className="focus-within:outline-none placeholder:text-smoother-slate w-full md:w-80
                 border-smoother-slate/20 border-2 px-3 py-2 rounded-lg text-smooth-slate bg-gray/30 focus-within:border-2 focus-within:border-secondary"
            />
            <div className="ml-5 flex">
              <span className="ml-2 flex items-center">
                <abbr title="Filter">
                  <IoFilter
                    fill="#5a719d"
                    className="text-2xl hover:fill-solid-slate cursor-pointer"
                  />
                </abbr>
              </span>
              <span
                onClick={deleteMultiple}
                className=" ml-6 flex items-center">
                <abbr title="Delete">
                  <IoTrashBinOutline
                    stroke="#5a719d"
                    className="text-2xl [&>path]:stroke-[40px] [&>rect]:stroke-[40px] hover:stroke-solid-slate cursor-pointer"
                  />
                </abbr>
              </span>
              <span
                className=" ml-6 flex items-center"
                onClick={() => setShowInput(true)}>
                <abbr title="Add">
                  <IoAddCircleOutline
                    stroke="#5a719d"
                    className="text-2xl [&>path]:stroke-[40px] [&>rect]:stroke-[40px] hover:stroke-solid-slate cursor-pointer"
                  />
                </abbr>
              </span>
            </div>
          </div>
        </div>
        <div className="mt-5 w-full flex">
          <table className="table-auto border-collapse divide-y divide-smoother-slate/50 w-full">
            <thead className="bg-gray">
              <tr>
                <th className="text-start p-4 text-sm font-sourceSans font-medium text-solid-slate uppercase">
                  <div className="flex item-center">
                    <input
                      onChange={(e) => {
                        setIsCheck(!isCheck);
                        const ckbx = getAllCkbx("tag").rawNode;
                        const value = e.target.checked;
                        ckbx.forEach((item) => {
                          item.checked = value;
                        });
                      }}
                      checked={isCheck}
                      type="checkbox"
                      name="checkAll"
                      className="w-4 h-4"
                    />
                  </div>
                </th>
                <th
                  scope="col"
                  className="text-start p-4 w-16 text-sm font-sourceSans font-medium text-solid-slate uppercase">
                  #
                </th>
                <th
                  scope="col"
                  className="text-start p-4 text-sm font-sourceSans font-medium text-solid-slate uppercase">
                  Tag
                </th>
                <th
                  scope="col"
                  className="text-start p-4 w-10 md:w-36 text-sm font-sourceSans font-medium text-solid-slate uppercase">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-[#5a719d]/20 divide-y bg-white ">
              {showInput ? (
                <tr className="hover:bg-gray">
                  <td className="w-4 px-4">
                    <input type="checkbox" name="" id="" className="w-4 h-4" />
                  </td>
                  <td className="px-4 text-lg text-solid-slate font-sourceSans font-semibold text-gray-500 whitespace-nowrap dark:text-gray-400">
                    {data.length + 1}
                  </td>
                  <td className="px-4 text-lg text-solid-slate font-sourceSans font-semibold text-gray-500 whitespace-nowrap dark:text-gray-400">
                    <input
                      onChange={fieldHandler}
                      autoFocus
                      value={field}
                      autoComplete="off"
                      type="text"
                      name="tag"
                      id="tag"
                      className="focus-within:outline-none text-[#324567] bg-transparent placeholder:text-[#5a719d] font-sourceSans placeholder:font-medium border-b border-b-[#5a719d]/50 w-full"
                      placeholder="Type new tag"
                    />
                  </td>
                  <td className="px-4 md:w-fit w-10 py-2 space-x-1 whitespace-nowrap flex">
                    <button
                      onClick={submitHandler}
                      className="flex bg-emerald-500 rounded-sm text-sm items-center gap-1 font-sourceSans font-semibold text-white p-1">
                      <IoCheckmarkOutline className="[&>path]:stroke-[100px]" />
                    </button>
                    <button
                      onClick={() => {
                        setField("");
                        setShowInput(false);
                      }}
                      className="flex rounded-sm text-sm items-center gap-1 bg-red-500 py-1 font-sourceSans font-semibold text-white px-1">
                      <IoClose className="[&>path]:stroke-[60px]" />
                    </button>
                  </td>
                </tr>
              ) : null}
              {data.map((tag, i) => (
                <tr key={tag.id} className="hover:bg-gray">
                  <td className="w-4 px-4">
                    <input
                      onChange={ckbxChange}
                      type="checkbox"
                      name="tag"
                      id={tag.id}
                      data-name={tag.name}
                      className="w-4 h-4"
                    />
                  </td>
                  <td className="px-4 text-lg text-solid-slate font-sourceSans font-semibold text-gray-500 whitespace-nowrap dark:text-gray-400">
                    {i + 1}
                  </td>
                  <td className="px-4 text-lg text-solid-slate font-sourceSans font-semibold text-gray-500 whitespace-nowrap dark:text-gray-400">
                    {tag.edit ? (
                      <input
                        onChange={fieldHandler}
                        autoFocus
                        value={field}
                        autoComplete="off"
                        type="text"
                        name="newCategory"
                        id="newCategory"
                        className="focus-within:outline-none text-[#324567] bg-transparent placeholder:text-[#5a719d] font-sourceSans placeholder:font-medium border-b border-b-[#5a719d]/50 w-full"
                        placeholder="Type new category"
                      />
                    ) : (
                      tag.name
                    )}
                  </td>
                  <td className="px-4 md:w-fit  py-2 space-x-1 whitespace-nowrap flex">
                    {tag.edit ? (
                      <>
                        <button
                          onClick={() => saveEdit(tag)}
                          className="flex bg-emerald-500 rounded-sm text-sm items-center gap-1 font-sourceSans font-semibold text-white p-1">
                          <IoCheckmarkOutline className="[&>path]:stroke-[100px]" />
                        </button>
                        <button
                          onClick={() => {
                            setEdit(tag.id);
                            setField("");
                          }}
                          className="flex rounded-sm text-sm items-center gap-1 bg-red-500 py-1 font-sourceSans font-semibold text-white px-1">
                          <IoClose className="[&>path]:stroke-[60px]" />
                        </button>
                      </>
                    ) : (
                      <>
                        <button
                          onClick={() => {
                            if (field) return alert("Please save latest edit");
                            setField(tag.name);
                            setEdit(tag.id);
                          }}
                          className="flex rounded-sm text-sm items-center gap-1 bg-primary py-1 font-sourceSans font-semibold text-white px-1">
                          <IoCreateOutline className="[&>path]:stroke-[50px]" />
                        </button>
                        <button
                          onClick={() =>
                            confirm(`Delete tag "${tag.name}"`)
                              ? deleteTag(tag.id)
                              : null
                          }
                          className="flex rounded-sm text-sm items-center gap-1 bg-red-500 py-1 font-sourceSans font-semibold text-white px-1">
                          <IoTrash />
                        </button>
                      </>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {data.length == 0 ? (
            <div className="absolute z-10 left-28 w-1/2 flex flex-col justify-center items-center text-center mt-44">
              <IoSkullOutline className="stroke-smoother-slate text-xl" />
              <p className="w-full font-sourceSans text-lg text-smoother-slate ">
                Tags Not Found
              </p>
            </div>
          ) : null}
        </div>
      </div>
    </Layout>
  );
};

export default Tags;
