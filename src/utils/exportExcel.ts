import ExcelJS from 'exceljs';
import { saveAs } from 'file-saver';
import dayjs from 'dayjs';
import { DataType } from '@/components/business/layouts/shared-layout/type';
import { isArray } from 'lodash';

export const exportListToExcel = async (
  data: any[],
  header: DataType<any>[],
  name: string,
	additionalInfo?: { key: string; value: any }[]
) => {
  const workbook = new ExcelJS.Workbook();
  const worksheet = workbook.addWorksheet('Sheet1');
  const imageColumnKey = 'thumbnail_image';

	if (additionalInfo && additionalInfo.length > 0) {
    additionalInfo.forEach(info => {
      const row = worksheet.addRow([info.key, info.value]);
      row.eachCell({ includeEmpty: true }, cell => {
				cell.font = { bold: true };
				cell.alignment = {
					horizontal: 'left',
					vertical: 'middle',
					wrapText: true,
				};
				cell.border = {
					top: { style: 'thin' },
					left: { style: 'thin' },
					bottom: { style: 'thin' },
					right: { style: 'thin' },
				};
			});
    });
  }
  // Add table headers
  const headers = header.map(column => column.title);
  const headerRow = worksheet.addRow(headers);

  // Style for header row
  headerRow.eachCell({ includeEmpty: true }, cell => {
    cell.font = { bold: true };
    cell.alignment = {
      horizontal: 'left',
      vertical: 'middle',
      wrapText: true,
    };
    cell.border = {
      top: { style: 'thin' },
      left: { style: 'thin' },
      bottom: { style: 'thin' },
      right: { style: 'thin' },
    };
    cell.fill = {
      type: 'pattern',
      pattern: 'solid',
      fgColor: { argb: 'FFCCCCCC' },
    };
  });

  // Add data to table
  for (let record of data) {
    const row = header.map(column => {
      const keys = column.key?.split('.');
      let value = record;
      if (isArray(keys)) {
        for (const key of keys) {
          value = value ? value[key] : '';
        }
      }
      return value;
    });

    const dataRow = worksheet.addRow(row);

    // Style for data rows
    dataRow.eachCell({ includeEmpty: true }, cell => {
      cell.border = {
        top: { style: 'thin' },
        left: { style: 'thin' },
        bottom: { style: 'thin' },
        right: { style: 'thin' },
      };
      cell.alignment = {
        horizontal: 'left',
        vertical: 'middle',
        wrapText: true,
      };
    });
    if (record[imageColumnKey]) {
      const image = await fetch(record[imageColumnKey]).then(res => res.blob());
      const reader = new FileReader();

      await new Promise<void>(resolve => {
        reader.onload = () => {
          if (reader.result) {
            const base64Image = reader.result.toString().split(',')[1];
            const imageId = workbook.addImage({
              base64: base64Image,
              extension: 'png',
            });

            /// Tìm chỉ số cột cho imageColumnKey
            const imageColumnIndex = header.findIndex(col => col.key === imageColumnKey);
            if (imageColumnIndex !== -1) {
              worksheet.getColumn(imageColumnIndex + 1).width = 50;
              worksheet.getRow(dataRow.number).height = 50;
              worksheet.addImage(imageId, {
                tl: { col: imageColumnIndex, row: dataRow.number - 1 }, // Chèn vào hàng dữ liệu đúng
                ext: {
                  width: 68, // Kích thước chiều rộng hình ảnh
                  height: 65 // Kích thước chiều cao hình ảnh
                },
              });

              // Xóa dữ liệu trong ô tương ứng
              dataRow.getCell(imageColumnIndex + 1).value = null;
            }
          }
          resolve();
        };
        reader.readAsDataURL(image);
      });
    }
  }

  // Auto-fit column widths based on content
  header.forEach((column, colIndex) => {
    let maxLength = column.title.length + 2; // Initial with header length
    worksheet.getColumn(colIndex + 1).eachCell({ includeEmpty: true }, cell => {
      const cellLength = cell.value ? cell.value.toString().length : 0;
      if (cellLength > maxLength) {
        maxLength = cellLength;
      }
    });
    worksheet.getColumn(colIndex + 1).width = maxLength < 10 ? 10 : maxLength;
  });

  // Export to Excel file
  const buffer = await workbook.xlsx.writeBuffer();
  const fileName = `${name}_${dayjs().format('YYMMDDHHmmss')}.xlsx`;
  saveAs(new Blob([buffer]), fileName);
};


export const exportTemplateToExcel = async (
  sheets: { name: string; headers: DataType<any>[]; data: any[] }[],
  fileName: string,
	additionalInfo?: { key: string; value: any }[]
) => {
  const workbook = new ExcelJS.Workbook();

  for (let index = 0; index < sheets.length; index++) {
		const { name, headers, data } = sheets[index];
    const worksheet = workbook.addWorksheet(name);
    const imageColumnKey = 'thumbnail_image';

		if (additionalInfo && additionalInfo.length > 0) {
			additionalInfo.forEach(info => {
				const row = worksheet.addRow([info.key, info.value]);
				row.eachCell({ includeEmpty: true }, cell => {
					cell.font = { bold: true };
					cell.alignment = {
						horizontal: 'left',
						vertical: 'middle',
						wrapText: true,
					};
					cell.border = {
						top: { style: 'thin' },
						left: { style: 'thin' },
						bottom: { style: 'thin' },
						right: { style: 'thin' },
					};
				});
			});
		}

    // Thêm tiêu đề bảng
    const headerTitles = headers.map(column => column.title);
    const headerRow = worksheet.addRow(headerTitles);

    // Style tiêu đề
    headerRow.eachCell({ includeEmpty: true }, cell => {
      cell.font = { bold: true };
      cell.alignment = {
        horizontal: 'center',
        vertical: 'middle',
        wrapText: true,
      };
      cell.border = {
        top: { style: 'thin' },
        left: { style: 'thin' },
        bottom: { style: 'thin' },
        right: { style: 'thin' },
      };
      cell.fill = {
        type: 'pattern',
        pattern: 'solid',
        fgColor: { argb: 'ffffff' },
      };
    });

    // Thêm dữ liệu vào bảng
    for (let record of data) {
      const row = headers.map(column => {
        const keys = column.key?.split('.');
        let value = record;
        if (isArray(keys)) {
          for (const key of keys) {
            value = value ? value[key] : '';
          }
        }
        return value;
      });

      const dataRow = worksheet.addRow(row);

      // Style cho từng dòng dữ liệu
      dataRow.eachCell({ includeEmpty: true }, cell => {
        cell.border = {
          top: { style: 'thin' },
          left: { style: 'thin' },
          bottom: { style: 'thin' },
          right: { style: 'thin' },
        };
        cell.alignment = {
          horizontal: 'left',
          vertical: 'middle',
          wrapText: true,
        };
      });

      // Xử lý hình ảnh nếu có
      if (record[imageColumnKey]) {
        const image = await fetch(record[imageColumnKey]).then(res => res.blob());
        const reader = new FileReader();

        await new Promise<void>(resolve => {
          reader.onload = () => {
            if (reader.result) {
              const base64Image = reader.result.toString().split(',')[1];
              const imageId = workbook.addImage({
                base64: base64Image,
                extension: 'png',
              });

              // Xác định vị trí cột chứa hình ảnh
              const imageColumnIndex = headers.findIndex(col => col.key === imageColumnKey);
              if (imageColumnIndex !== -1) {
                worksheet.getColumn(imageColumnIndex + 1).width = 50;
                worksheet.getRow(dataRow.number).height = 50;
                worksheet.addImage(imageId, {
                  tl: { col: imageColumnIndex, row: dataRow.number - 1 }, // Chèn vào ô phù hợp
                  ext: { width: 68, height: 65 }, // Kích thước ảnh
                });

                // Xóa dữ liệu trong ô hình ảnh
                dataRow.getCell(imageColumnIndex + 1).value = null;
              }
            }
            resolve();
          };
          reader.readAsDataURL(image);
        });
      }
    }

    // Căn chỉnh độ rộng cột tự động
    headers.forEach((column, colIndex) => {
      let maxLength = column.title.length + 2;
			const headerCell = worksheet.getCell(1, colIndex + 1);
      worksheet.getColumn(colIndex + 1).eachCell({ includeEmpty: true }, cell => {
        const cellLength = cell.value ? cell.value.toString().length : 0;
        if (cellLength > maxLength) {
          maxLength = cellLength;
        }
      });
      worksheet.getColumn(colIndex + 1).width = maxLength < 10 ? 10 : maxLength;
			if (column.description) {
				headerCell.note = column.description;
			}
    });

		if (index !== 0) {
      worksheet.protect("your-password", {
        selectLockedCells: true,
        selectUnlockedCells: true,
        formatCells: false,
        formatColumns: false,
        formatRows: false,
        insertColumns: false,
        insertRows: false,
        deleteColumns: false,
        deleteRows: false,
        sort: false,
        autoFilter: false,
      });
    }
  }

  // Xuất file Excel
  const buffer = await workbook.xlsx.writeBuffer();
  saveAs(new Blob([buffer]), `${fileName}.xlsx`);
	return true;
};

export const exportTemplateRateToExcel = async (
  sheets: { name: string; headers: DataType<any>[]; data: any[] }[],
  fileName: string,
	editableColumns: string[],
	messageError: string
) => {
  const workbook = new ExcelJS.Workbook();

  for (let index = 0; index < sheets.length; index++) {
    const { name, headers, data } = sheets[index];
    const worksheet = workbook.addWorksheet(name);

    // Thêm tiêu đề bảng
    const headerTitles = headers.map(column => column.title);
    const headerRow = worksheet.addRow(headerTitles);

    // Style tiêu đề
    headerRow.eachCell({ includeEmpty: true }, cell => {
      cell.font = { bold: true };
      cell.alignment = {
        horizontal: 'center',
        vertical: 'middle',
        wrapText: true,
      };
      cell.border = {
        top: { style: 'thin' },
        left: { style: 'thin' },
        bottom: { style: 'thin' },
        right: { style: 'thin' },
      };
      cell.fill = {
        type: 'pattern',
        pattern: 'solid',
        fgColor: { argb: 'ffffff' },
      };
    });

    // Thêm dữ liệu vào bảng
    for (let record of data) {
      const row = headers.map(column => {
        const keys = column.key?.split('.');
        let value = record;
        if (isArray(keys)) {
          for (const key of keys) {
            value = value ? value[key] : '';
          }
        }
        return value;
      });

      const dataRow = worksheet.addRow(row);

      // Style cho từng dòng dữ liệu
      dataRow.eachCell({ includeEmpty: true }, cell => {
        cell.border = {
          top: { style: 'thin' },
          left: { style: 'thin' },
          bottom: { style: 'thin' },
          right: { style: 'thin' },
        };
        cell.alignment = {
          horizontal: 'left',
          vertical: 'middle',
          wrapText: true,
        };
      });
    }

    headers.forEach((column, colIndex) => {
      let maxLength = column.title.length + 2;
			const headerCell = worksheet.getCell(1, colIndex + 1);
      worksheet.getColumn(colIndex + 1).eachCell({ includeEmpty: true }, cell => {
        const cellLength = cell.value ? cell.value.toString().length : 0;
        if (cellLength > maxLength) {
          maxLength = cellLength;
        }
      });
      worksheet.getColumn(colIndex + 1).width = maxLength < 10 ? 10 : maxLength;
			if (column.description) {
				headerCell.note = column.description;
			}
    });

    // if (name === "Rate") {
      const editableColumnIndexes = headers
        .map((column, colIndex) => (editableColumns.includes(column.title) ? colIndex + 1 : null))
        .filter(index => index !== null);

				worksheet.eachRow((row) => {
					row.protection = { locked: false };
				});

				worksheet.eachRow((row, rowNumber) => {
					row.eachCell((cell, colNumber) => {
						if (!editableColumnIndexes.includes(colNumber)) {

							cell.dataValidation = {
								type: 'custom',
								formulae: ['FALSE'],
								showErrorMessage: true,
								errorTitle: 'Error',
								error: messageError,
							};
						}
					});
				});

      await worksheet.protect("cms_password_12345", {
        selectLockedCells: true,
        selectUnlockedCells: true,
        formatCells: false,
        formatColumns: false,
        formatRows: false,
        insertColumns: false,
        insertRows: false,
        deleteColumns: false,
        deleteRows: true,
        sort: false,
        autoFilter: false,
      });
    }
  // }

  // Xuất file Excel
  const buffer = await workbook.xlsx.writeBuffer();
  saveAs(new Blob([buffer]), `${fileName}.xlsx`);
  return true;
};