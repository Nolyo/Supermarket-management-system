const fs = require('fs');
const path = require('path');
const items = require('./items.json');

function setPrice() {
  const pathFile = path.join(__dirname, 'SaveFile.es3');
  const data = fs.readFileSync(pathFile, 'utf8');
  const correctedData = data.replace(/([{,]\s*)(\d+)(\s*:)/g, '$1"$2"$3');
  const jsoned = JSON.parse(correctedData);
  const rack = jsoned.Progression.value.RackDatas;
  rack?.forEach((floor) => {
    floor.RackSlots.forEach((slot) => {
      slot.RackedBoxDatas.forEach((box) => {
        const indexItem = items.findIndex(
          (ite) => parseInt(ite.id, 10) === box.ProductID,
        );
        if (indexItem !== -1) {
          items[indexItem].size = box.Size.toString();
        } else {
          console.log(box);
        }
      });
    });
  });
  const outputPath = path.join(__dirname, 'items_tmp.json');
  fs.writeFileSync(outputPath, JSON.stringify(items, null, 2));
  // console.log(items.find((i) => i.size === '0'));
}

setPrice();
