package com.networkmonitor.scanner.xml;

import com.fasterxml.jackson.dataformat.xml.annotation.JacksonXmlElementWrapper;
import com.fasterxml.jackson.dataformat.xml.annotation.JacksonXmlProperty;
import lombok.Getter;
import lombok.Setter;

import java.util.List;

@Setter
@Getter
public class NmapPorts {

    @JacksonXmlProperty(localName = "port")
    @JacksonXmlElementWrapper(useWrapping = false)
    private List<NmapPort> portList;

}